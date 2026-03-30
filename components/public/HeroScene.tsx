'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { EffectComposer, RenderPass, BloomEffect, EffectPass } from 'postprocessing'

// ─── GLSL: Domain-warped noise for the background plane ───
const bgVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

const bgFragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  varying vec2 vUv;

  // Simplex-like hash noise
  vec3 hash33(vec3 p) {
    p = fract(p * vec3(443.897, 441.423, 437.195));
    p += dot(p, p.yzx + 19.19);
    return fract((p.xxy + p.yzz) * p.zyx);
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = dot(hash33(i), f - vec3(0.0));
    float b = dot(hash33(i + vec3(1,0,0)), f - vec3(1,0,0));
    float c = dot(hash33(i + vec3(0,1,0)), f - vec3(0,1,0));
    float d = dot(hash33(i + vec3(1,1,0)), f - vec3(1,1,0));
    float e = dot(hash33(i + vec3(0,0,1)), f - vec3(0,0,1));
    float g = dot(hash33(i + vec3(1,0,1)), f - vec3(1,0,1));
    float h = dot(hash33(i + vec3(0,1,1)), f - vec3(0,1,1));
    float j = dot(hash33(i + vec3(1,1,1)), f - vec3(1,1,1));
    return mix(mix(mix(a,b,f.x),mix(c,d,f.x),f.y),mix(mix(e,g,f.x),mix(h,j,f.x),f.y),f.z);
  }

  // Fractal Brownian Motion
  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.1;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

    // Mouse influence — subtle warp
    vec2 mouse = (uMouse - 0.5) * vec2(aspect, 1.0);
    float mouseDist = length(p - mouse);
    float mouseInfluence = smoothstep(0.8, 0.0, mouseDist) * 0.15;

    // Domain warping: fbm(p + fbm(p + fbm(p))) — creates marble/smoke
    float t = uTime * 0.08;
    vec3 q = vec3(p * 1.5, t);
    float f1 = fbm(q + mouseInfluence);
    float f2 = fbm(q + vec3(f1 * 2.0, f1 * 1.5, t * 0.5));
    float f3 = fbm(q + vec3(f2 * 1.5, f2 * 2.0, t * 0.3));

    // Color: dark base with gold veins
    vec3 darkBase = vec3(0.027, 0.027, 0.027); // #070707
    vec3 goldVein = vec3(0.77, 0.64, 0.35);     // #C4A45A
    vec3 warmDark = vec3(0.06, 0.04, 0.02);

    // Mix based on noise — gold appears in the crevices
    float goldMask = smoothstep(0.15, 0.45, f3) * smoothstep(0.65, 0.35, f3);
    goldMask = pow(goldMask, 2.0) * 0.6;

    // Add subtle warm tones in mid-values
    float warmMask = smoothstep(0.2, 0.5, f2) * 0.3;

    vec3 color = darkBase;
    color = mix(color, warmDark, warmMask);
    color = mix(color, goldVein * 0.15, goldMask);

    // Vignette
    float vig = 1.0 - smoothstep(0.3, 1.2, length(p * 0.9));
    color *= 0.7 + vig * 0.3;

    // Mouse spotlight — subtle golden glow near cursor
    float spotlight = smoothstep(0.5, 0.0, mouseDist) * 0.04;
    color += goldVein * spotlight;

    gl_FragColor = vec4(color, 1.0);
  }
`

// ─── GLSL: Instanced city vertex shader with wave animation ───
const cityVertexShader = `
  uniform float uTime;
  uniform vec3 uMouse3D;

  attribute vec3 aOffset;
  attribute float aScale;
  attribute float aPhase;
  attribute float aHeight;

  varying float vGlow;
  varying float vHeight;

  void main() {
    vec3 pos = position;

    // Scale the box
    pos.xz *= aScale;
    pos.y *= aHeight;

    // Position in the city
    pos += aOffset;
    pos.y += aHeight * 0.5;

    // Wave animation — buildings breathe
    float wave = sin(aOffset.x * 0.3 + uTime * 0.5 + aPhase) *
                 cos(aOffset.z * 0.4 + uTime * 0.3) * 0.3;
    pos.y += wave;

    // Mouse proximity glow
    float dist = length(aOffset.xz - uMouse3D.xz);
    vGlow = smoothstep(6.0, 0.0, dist);

    // Rise animation — staggered by distance from center
    float centerDist = length(aOffset.xz);
    float riseDelay = centerDist * 0.05;
    float riseProgress = clamp((uTime - riseDelay - 1.5) * 0.6, 0.0, 1.0);
    float eased = 1.0 - pow(1.0 - riseProgress, 3.0);
    pos.y *= eased;

    vHeight = aHeight / 8.0;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const cityFragmentShader = `
  uniform float uTime;
  varying float vGlow;
  varying float vHeight;

  void main() {
    vec3 goldDim = vec3(0.55, 0.45, 0.22);
    vec3 goldBright = vec3(0.91, 0.81, 0.50);

    // Taller buildings are brighter
    float heightGlow = vHeight * 0.3;

    // Combine base + height + mouse proximity
    vec3 color = mix(goldDim * 0.15, goldBright * 0.5, vGlow * 0.8 + heightGlow);

    // Subtle pulse
    float pulse = sin(uTime * 2.0 + vHeight * 6.0) * 0.1 + 0.9;
    color *= pulse;

    // Opacity: edges visible, faces subtle
    float alpha = 0.08 + vGlow * 0.4 + heightGlow * 0.15;

    gl_FragColor = vec4(color, alpha);
  }
`

// ─── Curl-noise approximation for particle flow ───
function curlNoise(x: number, y: number, z: number, t: number): [number, number, number] {
  const e = 0.01
  const n1 = Math.sin(x * 1.5 + t) * Math.cos(z * 0.8 + t * 0.7)
  const n2 = Math.sin((x + e) * 1.5 + t) * Math.cos(z * 0.8 + t * 0.7)
  const n3 = Math.sin(x * 1.5 + t) * Math.cos((z + e) * 0.8 + t * 0.7)
  const n4 = Math.sin(y * 1.2 + t * 0.5) * Math.cos(x * 0.6 + t * 0.3)
  const n5 = Math.sin((y + e) * 1.2 + t * 0.5) * Math.cos(x * 0.6 + t * 0.3)

  return [
    (n5 - n4) / e * 0.003 - (n3 - n1) / e * 0.002,
    ((n2 - n1) / e - (n3 - n1) / e) * 0.002,
    (n2 - n1) / e * 0.003 - (n5 - n4) / e * 0.002,
  ]
}

export default function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // ─── SCENE ───
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, canvas.clientWidth / canvas.clientHeight, 0.1, 200)
    camera.position.set(0, 10, 24)
    camera.lookAt(0, 2, 0)

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.5

    // ─── POST PROCESSING: Bloom ───
    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    composer.addPass(new EffectPass(camera, new BloomEffect({
      intensity: 1.5,
      luminanceThreshold: 0.15,
      luminanceSmoothing: 0.7,
      mipmapBlur: true,
    })))

    // ─── BACKGROUND: Full-screen noise shader ───
    const bgScene = new THREE.Scene()
    const bgCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const bgUniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(canvas.clientWidth, canvas.clientHeight) },
    }
    const bgMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        vertexShader: bgVertexShader,
        fragmentShader: bgFragmentShader,
        uniforms: bgUniforms,
        depthWrite: false,
      })
    )
    bgScene.add(bgMesh)

    // ─── INSTANCED CITY: 2000 buildings ───
    const BUILDING_COUNT = 2000
    const boxGeo = new THREE.BoxGeometry(1, 1, 1)
    const cityMat = new THREE.ShaderMaterial({
      vertexShader: cityVertexShader,
      fragmentShader: cityFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse3D: { value: new THREE.Vector3(0, 0, 0) },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      wireframe: true,
    })

    // Use InstancedMesh with wireframe
    const cityGeo = new THREE.InstancedBufferGeometry()
    cityGeo.index = boxGeo.index
    cityGeo.attributes = { ...boxGeo.attributes }

    const offsets = new Float32Array(BUILDING_COUNT * 3)
    const scales = new Float32Array(BUILDING_COUNT)
    const phases = new Float32Array(BUILDING_COUNT)
    const heights = new Float32Array(BUILDING_COUNT)

    for (let i = 0; i < BUILDING_COUNT; i++) {
      // City layout: clustered in center, sparser at edges
      const angle = Math.random() * Math.PI * 2
      const radius = Math.pow(Math.random(), 0.6) * 18
      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 2
      const z = Math.sin(angle) * radius + (Math.random() - 0.5) * 2

      offsets[i * 3] = x
      offsets[i * 3 + 1] = 0
      offsets[i * 3 + 2] = z

      const distFromCenter = Math.sqrt(x * x + z * z)
      const heightMultiplier = Math.max(0.2, 1 - distFromCenter * 0.04)

      scales[i] = 0.15 + Math.random() * 0.5
      phases[i] = Math.random() * Math.PI * 2
      heights[i] = (1 + Math.random() * 7) * heightMultiplier
    }

    cityGeo.setAttribute('aOffset', new THREE.InstancedBufferAttribute(offsets, 3))
    cityGeo.setAttribute('aScale', new THREE.InstancedBufferAttribute(scales, 1))
    cityGeo.setAttribute('aPhase', new THREE.InstancedBufferAttribute(phases, 1))
    cityGeo.setAttribute('aHeight', new THREE.InstancedBufferAttribute(heights, 1))

    const cityMesh = new THREE.Mesh(cityGeo, cityMat)
    cityMesh.frustumCulled = false
    scene.add(cityMesh)

    // ─── GOLDEN PARTICLES: 400 embers with curl-noise flow ───
    const PARTICLE_COUNT = 400
    const pPositions = new Float32Array(PARTICLE_COUNT * 3)
    const pSizes = new Float32Array(PARTICLE_COUNT)
    const pVelocities: number[] = []

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 30
      pPositions[i * 3 + 1] = Math.random() * 15
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 20
      pSizes[i] = 0.03 + Math.random() * 0.08
      pVelocities.push(0, 0, 0)
    }

    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3))

    const pMat = new THREE.PointsMaterial({
      color: 0xE8D080,
      size: 0.12,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    })
    const particleSystem = new THREE.Points(pGeo, pMat)
    scene.add(particleSystem)

    // ─── GROUND: Radial grid with golden lines ───
    const gridSize = 50
    const gridDiv = 50
    const grid = new THREE.GridHelper(gridSize, gridDiv, 0xC4A45A, 0xC4A45A)
    ;(grid.material as THREE.Material).opacity = 0.03
    ;(grid.material as THREE.Material).transparent = true
    grid.position.y = -0.1
    scene.add(grid)

    // ─── FOG ───
    scene.fog = new THREE.FogExp2(0x070707, 0.025)

    // ─── MOUSE ───
    let mouseNormX = 0.5
    let mouseNormY = 0.5
    let targetCamX = 0
    let targetCamY = 10
    let camX = 0
    let camY = 10
    const mouse3D = new THREE.Vector3()

    const onMouseMove = (e: MouseEvent) => {
      mouseNormX = e.clientX / window.innerWidth
      mouseNormY = e.clientY / window.innerHeight
      targetCamX = (mouseNormX - 0.5) * 6
      targetCamY = 10 + (mouseNormY - 0.5) * 4

      // Project mouse to 3D ground plane
      mouse3D.set(
        (mouseNormX - 0.5) * 20,
        0,
        (mouseNormY - 0.5) * -12
      )
    }
    window.addEventListener('mousemove', onMouseMove)

    // ─── ANIMATION ───
    let time = 0
    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const delta = clock.getDelta()
      time += delta

      // Smooth camera
      camX += (targetCamX - camX) * 0.015
      camY += (targetCamY - camY) * 0.015
      camera.position.x = camX
      camera.position.y = camY
      camera.lookAt(0, 2, 0)

      // Update uniforms
      bgUniforms.uTime.value = time
      bgUniforms.uMouse.value.set(mouseNormX, 1.0 - mouseNormY)
      cityMat.uniforms.uTime.value = time
      cityMat.uniforms.uMouse3D.value.copy(mouse3D)

      // Particles: curl-noise flow
      const pos = pGeo.attributes.position.array as Float32Array
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const px = pos[i * 3]
        const py = pos[i * 3 + 1]
        const pz = pos[i * 3 + 2]

        const [cx, cy, cz] = curlNoise(px * 0.15, py * 0.15, pz * 0.15, time * 0.3)
        pos[i * 3] += cx + (Math.random() - 0.5) * 0.005
        pos[i * 3 + 1] += cy + 0.008 // gentle rise
        pos[i * 3 + 2] += cz + (Math.random() - 0.5) * 0.005

        // Reset if too high or too far
        if (py > 18 || Math.abs(px) > 20 || Math.abs(pz) > 15) {
          pos[i * 3] = (Math.random() - 0.5) * 25
          pos[i * 3 + 1] = -1 + Math.random() * 2
          pos[i * 3 + 2] = (Math.random() - 0.5) * 16
        }
      }
      pGeo.attributes.position.needsUpdate = true

      // Grid pulse
      ;(grid.material as THREE.Material).opacity = 0.025 + Math.sin(time * 0.4) * 0.008

      // Render background first (no depth), then scene with bloom
      renderer.autoClear = false
      renderer.clear()
      renderer.render(bgScene, bgCamera)
      composer.render()
    }

    animate()

    // ─── RESIZE ───
    const onResize = () => {
      if (!canvas.parentElement) return
      const w = canvas.parentElement.clientWidth
      const h = canvas.parentElement.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      composer.setSize(w, h)
      bgUniforms.uResolution.value.set(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      composer.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
    />
  )
}
