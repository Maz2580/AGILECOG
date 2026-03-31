'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import { Reflector } from 'three/examples/jsm/objects/Reflector.js'
import { EffectComposer, RenderPass, BloomEffect, EffectPass, VignetteEffect } from 'postprocessing'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PaintingLightbox from './PaintingLightbox'

gsap.registerPlugin(ScrollTrigger)

// ─── Painting data ───
const paintingsData = [
  { src: '/images/marble-bathroom.jpg', label: 'Marble & Light', room: 'Bathroom', alt: 'Marble & Light', wall: 'left' as const },
  { src: '/images/kitchen-marble.jpg', label: 'Stone & Craft', room: 'Kitchen', alt: 'Stone & Craft', wall: 'right' as const },
  { src: '/images/bedroom-ambient.jpg', label: 'Warmth & Rest', room: 'Bedroom', alt: 'Warmth & Rest', wall: 'left' as const },
  { src: '/images/wardrobe-niche.jpg', label: 'Form & Function', room: 'Wardrobe', alt: 'Form & Function', wall: 'right' as const },
  { src: '/images/timber-panel.jpg', label: 'Timber & Glow', room: 'Joinery', alt: 'Timber & Glow', wall: 'left' as const },
  { src: '/images/kitchen-detail.jpg', label: 'Detail & Finish', room: 'Kitchen Detail', alt: 'Detail & Finish', wall: 'right' as const },
  { src: '/images/bedroom-daylight.jpg', label: 'Light & Space', room: 'Master Suite', alt: 'Light & Space', wall: 'center' as const },
]

// ─── Shader: Volumetric light cone ───
const coneVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const coneFragmentShader = `
  uniform vec3 lightColor;
  uniform float intensity;
  varying vec2 vUv;
  void main() {
    float alpha = intensity * smoothstep(0.0, 1.0, 1.0 - vUv.y);
    alpha *= smoothstep(0.0, 0.2, vUv.y);
    // Soften edges horizontally
    float edgeFade = smoothstep(0.0, 0.3, vUv.x) * smoothstep(1.0, 0.7, vUv.x);
    alpha *= edgeFade;
    gl_FragColor = vec4(lightColor, alpha * 0.6);
  }
`

// ─── Shader: Dust particles that catch light ───
const dustVertexShader = `
  attribute float size;
  attribute float speed;
  uniform float uTime;
  uniform vec3 uLights[7];
  varying float vLight;

  void main() {
    vec3 pos = position;
    pos.y += sin(uTime * speed * 0.4 + position.x * 0.5) * 0.25;
    pos.x += cos(uTime * speed * 0.3 + position.z) * 0.08;
    pos.z += sin(uTime * speed * 0.2 + position.y) * 0.04;

    // Wrap Y
    pos.y = mod(pos.y, 5.0);

    // Light proximity — glow near spotlights
    float minDist = 100.0;
    for (int i = 0; i < 7; i++) {
      float d = length(pos - uLights[i]);
      minDist = min(minDist, d);
    }
    vLight = smoothstep(6.0, 0.5, minDist);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = size * (180.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`
const dustFragmentShader = `
  uniform vec3 uColor;
  varying float vLight;

  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float circle = 1.0 - smoothstep(0.0, 1.0, d);
    float alpha = circle * (0.08 + vLight * 0.7);
    vec3 color = uColor * (0.4 + vLight * 2.0);
    gl_FragColor = vec4(color, alpha);
  }
`

// ─── Ornate frame geometry helper ───
function createOrnateFrame(width: number, height: number, depth: number): THREE.Group {
  const group = new THREE.Group()
  const frameW = 0.15
  const gold = new THREE.MeshStandardMaterial({
    color: 0xc9a84c,
    roughness: 0.3,
    metalness: 0.7,
    emissive: 0x3a2a08,
    emissiveIntensity: 0.1,
  })
  const darkGold = new THREE.MeshStandardMaterial({
    color: 0x6b4f1a,
    roughness: 0.5,
    metalness: 0.5,
  })

  // Outer frame (4 bars)
  const outerW = width + frameW * 2

  // Top
  const topBar = new THREE.Mesh(new THREE.BoxGeometry(outerW, frameW, depth), gold)
  topBar.position.set(0, height / 2 + frameW / 2, 0)
  group.add(topBar)
  // Bottom
  const botBar = new THREE.Mesh(new THREE.BoxGeometry(outerW, frameW, depth), gold)
  botBar.position.set(0, -height / 2 - frameW / 2, 0)
  group.add(botBar)
  // Left
  const leftBar = new THREE.Mesh(new THREE.BoxGeometry(frameW, height, depth), gold)
  leftBar.position.set(-width / 2 - frameW / 2, 0, 0)
  group.add(leftBar)
  // Right
  const rightBar = new THREE.Mesh(new THREE.BoxGeometry(frameW, height, depth), gold)
  rightBar.position.set(width / 2 + frameW / 2, 0, 0)
  group.add(rightBar)

  // Inner lip (darker inset)
  const lipW = 0.04
  const lipMeshes = [
    new THREE.Mesh(new THREE.BoxGeometry(width + lipW * 2, lipW, depth + 0.02), darkGold),
    new THREE.Mesh(new THREE.BoxGeometry(width + lipW * 2, lipW, depth + 0.02), darkGold),
    new THREE.Mesh(new THREE.BoxGeometry(lipW, height, depth + 0.02), darkGold),
    new THREE.Mesh(new THREE.BoxGeometry(lipW, height, depth + 0.02), darkGold),
  ]
  lipMeshes[0].position.set(0, height / 2, 0.01)
  lipMeshes[1].position.set(0, -height / 2, 0.01)
  lipMeshes[2].position.set(-width / 2, 0, 0.01)
  lipMeshes[3].position.set(width / 2, 0, 0.01)
  lipMeshes.forEach(m => group.add(m))

  return group
}

export default function GrandGallery() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [openPainting, setOpenPainting] = useState<number | null>(null)

  const [nearestPainting, setNearestPainting] = useState<{ index: number; screenX: number; screenY: number; opacity: number } | null>(null)

  const handleClose = useCallback(() => {
    setOpenPainting(null)
    document.body.style.overflow = ''
  }, [])

  const handleNavigate = useCallback((i: number) => setOpenPainting(i), [])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    // ─── SCENE SETUP ───
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x060606, 0.02)

    const camera = new THREE.PerspectiveCamera(55, canvas.clientWidth / canvas.clientHeight, 0.1, 200)
    camera.position.set(0, 2.4, 8)

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    })
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.6
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    // ─── POST-PROCESSING ───
    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    composer.addPass(new EffectPass(camera,
      new BloomEffect({ intensity: 0.8, luminanceThreshold: 0.4, luminanceSmoothing: 0.6, mipmapBlur: true }),
      new VignetteEffect({ darkness: 0.5, offset: 0.3 }),
    ))

    // ─── GALLERY GEOMETRY ───
    const GALLERY_LENGTH = 60
    const GALLERY_WIDTH = 10
    const GALLERY_HEIGHT = 6
    const WALL_COLOR = 0x1a1512
    const CEILING_COLOR = 0x0e0c0a

    const wallMat = new THREE.MeshStandardMaterial({ color: WALL_COLOR, roughness: 0.85, metalness: 0.0 })
    const ceilingMat = new THREE.MeshStandardMaterial({ color: CEILING_COLOR, roughness: 0.9 })

    // Left wall
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(GALLERY_LENGTH, GALLERY_HEIGHT), wallMat)
    leftWall.position.set(-GALLERY_WIDTH / 2, GALLERY_HEIGHT / 2, -GALLERY_LENGTH / 2 + 8)
    leftWall.rotation.y = Math.PI / 2
    leftWall.receiveShadow = true
    scene.add(leftWall)

    // Right wall
    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(GALLERY_LENGTH, GALLERY_HEIGHT), wallMat)
    rightWall.position.set(GALLERY_WIDTH / 2, GALLERY_HEIGHT / 2, -GALLERY_LENGTH / 2 + 8)
    rightWall.rotation.y = -Math.PI / 2
    rightWall.receiveShadow = true
    scene.add(rightWall)

    // Ceiling
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(GALLERY_WIDTH, GALLERY_LENGTH), ceilingMat)
    ceiling.position.set(0, GALLERY_HEIGHT, -GALLERY_LENGTH / 2 + 8)
    ceiling.rotation.x = Math.PI / 2
    scene.add(ceiling)

    // End wall (back of gallery — far end)
    const endWall = new THREE.Mesh(new THREE.PlaneGeometry(GALLERY_WIDTH, GALLERY_HEIGHT), wallMat)
    endWall.position.set(0, GALLERY_HEIGHT / 2, -GALLERY_LENGTH + 8)
    endWall.receiveShadow = true
    scene.add(endWall)

    // ─── REFLECTIVE MARBLE FLOOR ───
    const floorMirror = new Reflector(
      new THREE.PlaneGeometry(GALLERY_WIDTH, GALLERY_LENGTH),
      {
        clipBias: 0.003,
        textureWidth: canvas.clientWidth * 0.5,
        textureHeight: canvas.clientHeight * 0.5,
        color: 0x555555,
      }
    )
    floorMirror.rotation.x = -Math.PI / 2
    floorMirror.position.set(0, 0, -GALLERY_LENGTH / 2 + 8)
    scene.add(floorMirror)

    // Marble overlay (semi-transparent for texture on top of reflection)
    const marbleOverlay = new THREE.Mesh(
      new THREE.PlaneGeometry(GALLERY_WIDTH, GALLERY_LENGTH),
      new THREE.MeshStandardMaterial({
        color: 0x1a1815,
        roughness: 0.15,
        metalness: 0.05,
        transparent: true,
        opacity: 0.55,
      })
    )
    marbleOverlay.rotation.x = -Math.PI / 2
    marbleOverlay.position.set(0, 0.001, -GALLERY_LENGTH / 2 + 8)
    scene.add(marbleOverlay)

    // ─── AMBIENT LIGHT ───
    const ambient = new THREE.AmbientLight(0xfff4e0, 0.2)
    scene.add(ambient)

    // ─── CROWN MOLDING (gold strip along ceiling edges) ───
    const moldingMat = new THREE.MeshStandardMaterial({
      color: 0xc9a84c,
      roughness: 0.4,
      metalness: 0.6,
      emissive: 0x3a2a08,
      emissiveIntensity: 0.15,
    })
    const moldingGeo = new THREE.BoxGeometry(0.06, 0.06, GALLERY_LENGTH)
    const moldingL = new THREE.Mesh(moldingGeo, moldingMat)
    moldingL.position.set(-GALLERY_WIDTH / 2 + 0.03, GALLERY_HEIGHT - 0.03, -GALLERY_LENGTH / 2 + 8)
    scene.add(moldingL)
    const moldingR = new THREE.Mesh(moldingGeo, moldingMat)
    moldingR.position.set(GALLERY_WIDTH / 2 - 0.03, GALLERY_HEIGHT - 0.03, -GALLERY_LENGTH / 2 + 8)
    scene.add(moldingR)

    // Baseboard (dark)
    const baseboardMat = new THREE.MeshStandardMaterial({ color: 0x0a0806, roughness: 0.9 })
    const baseboardGeo = new THREE.BoxGeometry(0.08, 0.2, GALLERY_LENGTH)
    const baseL = new THREE.Mesh(baseboardGeo, baseboardMat)
    baseL.position.set(-GALLERY_WIDTH / 2 + 0.04, 0.1, -GALLERY_LENGTH / 2 + 8)
    scene.add(baseL)
    const baseR = new THREE.Mesh(baseboardGeo, baseboardMat)
    baseR.position.set(GALLERY_WIDTH / 2 - 0.04, 0.1, -GALLERY_LENGTH / 2 + 8)
    scene.add(baseR)

    // ─── PAINTINGS ON THE WALLS ───
    const textureLoader = new THREE.TextureLoader()
    const paintingMeshes: THREE.Mesh[] = []
    const spotlights: THREE.SpotLight[] = []
    const lightPositions: THREE.Vector3[] = []

    const PAINT_W = 2.4
    const PAINT_H = 3.0
    const PAINT_SPACING = 7.5
    const WALL_OFFSET = 0.02

    paintingsData.forEach((p, i) => {
      const z = -i * PAINT_SPACING + 2
      const isLeft = p.wall === 'left'
      const isCenter = p.wall === 'center'
      const x = isCenter ? 0 : isLeft ? -GALLERY_WIDTH / 2 + WALL_OFFSET : GALLERY_WIDTH / 2 - WALL_OFFSET
      const rotY = isCenter ? 0 : isLeft ? Math.PI / 2 : -Math.PI / 2

      // Frame
      const frame = createOrnateFrame(PAINT_W, PAINT_H, 0.08)
      frame.position.set(x, 2.8, z)
      frame.rotation.y = rotY
      scene.add(frame)

      // Painting plane
      const paintGeo = new THREE.PlaneGeometry(PAINT_W, PAINT_H)
      const paintMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.3,
        metalness: 0.0,
        emissive: 0xffffff,
        emissiveIntensity: 0.15,
      })

      const paintMesh = new THREE.Mesh(paintGeo, paintMat)
      paintMesh.position.set(x, 2.8, z)
      paintMesh.rotation.y = rotY
      // Offset slightly in front of wall
      const offsetDir = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), rotY)
      paintMesh.position.add(offsetDir.multiplyScalar(0.04))
      paintMesh.castShadow = true
      paintMesh.userData = { index: i }
      scene.add(paintMesh)
      paintingMeshes.push(paintMesh)

      // Load texture
      textureLoader.load(p.src, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy()
        paintMat.map = tex
        paintMat.needsUpdate = true
      })

      // Spotlight above painting
      const lightPos = new THREE.Vector3(
        isCenter ? 0 : isLeft ? x + 1.5 : x - 1.5,
        GALLERY_HEIGHT - 0.3,
        z
      )
      const spot = new THREE.SpotLight(0xfff4e0, 5, 15, Math.PI / 4.5, 0.5, 1.2)
      spot.position.copy(lightPos)
      spot.target.position.set(x, 2.2, z)
      spot.castShadow = true
      spot.shadow.mapSize.set(512, 512)
      scene.add(spot)
      scene.add(spot.target)
      spotlights.push(spot)
      lightPositions.push(lightPos)

      // Volumetric light cone
      const coneGeo = new THREE.ConeGeometry(1.2, 4, 16, 1, true)
      const coneMat = new THREE.ShaderMaterial({
        vertexShader: coneVertexShader,
        fragmentShader: coneFragmentShader,
        uniforms: {
          lightColor: { value: new THREE.Color(0xfff4e0) },
          intensity: { value: 0.12 },
        },
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      const cone = new THREE.Mesh(coneGeo, coneMat)
      cone.position.set(lightPos.x, GALLERY_HEIGHT - 2.2, z)
      cone.rotation.x = Math.PI
      scene.add(cone)
    })

    // ─── ATMOSPHERIC DUST ───
    const DUST_COUNT = 600
    const dustPositions = new Float32Array(DUST_COUNT * 3)
    const dustSizes = new Float32Array(DUST_COUNT)
    const dustSpeeds = new Float32Array(DUST_COUNT)

    for (let i = 0; i < DUST_COUNT; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * GALLERY_WIDTH
      dustPositions[i * 3 + 1] = Math.random() * GALLERY_HEIGHT
      dustPositions[i * 3 + 2] = Math.random() * -GALLERY_LENGTH + 8
      dustSizes[i] = 1 + Math.random() * 2.5
      dustSpeeds[i] = 0.2 + Math.random() * 0.5
    }

    const dustGeo = new THREE.BufferGeometry()
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3))
    dustGeo.setAttribute('size', new THREE.BufferAttribute(dustSizes, 1))
    dustGeo.setAttribute('speed', new THREE.BufferAttribute(dustSpeeds, 1))

    const lightPosArray = lightPositions.length >= 7
      ? lightPositions
      : [...lightPositions, ...Array(7 - lightPositions.length).fill(new THREE.Vector3(0, 10, 0))]

    const dustMat = new THREE.ShaderMaterial({
      vertexShader: dustVertexShader,
      fragmentShader: dustFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0xfff8e7) },
        uLights: { value: lightPosArray },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const dust = new THREE.Points(dustGeo, dustMat)
    scene.add(dust)

    // ─── SCROLL-DRIVEN CAMERA ───
    let scrollTarget = 0
    let scrollCurrent = 0
    let mouseXNorm = 0.5
    let mouseYNorm = 0.5
    const TOTAL_DEPTH = GALLERY_LENGTH + 5

    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        scrollTarget = self.progress * TOTAL_DEPTH
      },
    })

    // Mouse for subtle head-turn
    const onMouseMove = (e: MouseEvent) => {
      mouseXNorm = e.clientX / window.innerWidth
      mouseYNorm = e.clientY / window.innerHeight
    }
    window.addEventListener('mousemove', onMouseMove)

    // Raycaster for click-to-open
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouse, camera)
      const hits = raycaster.intersectObjects(paintingMeshes)
      if (hits.length > 0) {
        const idx = hits[0].object.userData.index
        setOpenPainting(idx)
        document.body.style.overflow = 'hidden'
      }
    }
    canvas.addEventListener('click', onClick)

    // Hover cursor
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouse, camera)
      const hits = raycaster.intersectObjects(paintingMeshes)
      canvas.style.cursor = hits.length > 0 ? 'pointer' : 'default'
    }
    canvas.addEventListener('mousemove', onMove)

    // ─── ANIMATION LOOP ───
    const clock = new THREE.Clock()
    let animId: number

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()

      // Smooth camera movement
      scrollCurrent += (scrollTarget - scrollCurrent) * 0.04
      camera.position.z = 8 - scrollCurrent
      camera.position.y = 2.4

      // Mouse-driven head turn
      const headTurnX = (mouseXNorm - 0.5) * 1.2
      const headTurnY = (mouseYNorm - 0.5) * 0.4
      camera.rotation.y = -headTurnX * 0.08
      camera.rotation.x = -headTurnY * 0.04

      // Update dust
      dustMat.uniforms.uTime.value = elapsed

      // Spotlight + painting brightness based on camera proximity
      spotlights.forEach((spot) => {
        const dist = Math.abs(camera.position.z - spot.target.position.z)
        spot.intensity = dist < 10 ? 5 + (1 - dist / 10) * 6 : 5
      })

      // Paintings glow brighter as camera approaches + find nearest for hint
      let closestIdx = -1
      let closestDist = Infinity
      let closestProx = 0
      paintingMeshes.forEach((mesh, idx) => {
        const dist = Math.abs(camera.position.z - mesh.position.z)
        const prox = Math.max(0, 1 - dist / 8)
        const mat = mesh.material as THREE.MeshStandardMaterial
        mat.emissiveIntensity = 0.15 + prox * 0.35
        if (dist < closestDist && dist < 6) {
          closestDist = dist
          closestIdx = idx
          closestProx = prox
        }
      })

      // Project nearest painting to screen for HTML hint overlay
      if (closestIdx >= 0 && closestProx > 0.2) {
        const mesh = paintingMeshes[closestIdx]
        const pos = new THREE.Vector3().copy(mesh.position)
        pos.y -= 2.0 // below the painting
        pos.project(camera)
        const sx = (pos.x * 0.5 + 0.5) * canvas.clientWidth
        const sy = (-pos.y * 0.5 + 0.5) * canvas.clientHeight
        setNearestPainting({ index: closestIdx, screenX: sx, screenY: sy, opacity: Math.min(1, closestProx * 1.5) })
      } else {
        setNearestPainting(null)
      }

      // Render
      composer.render()
    }
    animate()

    // ─── RESIZE ───
    const onResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      composer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      scrollTriggerInstance.kill()
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      canvas.removeEventListener('click', onClick)
      canvas.removeEventListener('mousemove', onMove)
      renderer.dispose()
      composer.dispose()
    }
  }, [])

  return (
    <>
      {/* Scroll container — its height drives the walkthrough */}
      <div ref={containerRef} className="relative" style={{ height: '500vh' }}>
        {/* Fixed canvas */}
        <canvas
          ref={canvasRef}
          className="sticky top-0 w-full h-screen"
        />

        {/* Gallery header overlay */}
        <div className="absolute top-4 left-0 right-0 z-10 px-6 md:px-16 pointer-events-none">
          <div className="text-[0.5rem] tracking-[0.5em] uppercase text-gold/30 mb-2">
            The Grand Gallery
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-light text-text/40">
            Scroll to walk through
          </h2>
        </div>

        {/* Painting hint overlay — projected from 3D space */}
        {nearestPainting && (
          <div
            className="fixed z-20 pointer-events-none flex flex-col items-center gap-1.5 transition-opacity duration-500"
            style={{
              left: nearestPainting.screenX,
              top: nearestPainting.screenY,
              transform: 'translate(-50%, 0)',
              opacity: nearestPainting.opacity,
            }}
          >
            {/* Room name */}
            <span className="text-[0.55rem] tracking-[0.35em] uppercase text-gold/70 font-display">
              {paintingsData[nearestPainting.index].room}
            </span>
            {/* Painting title */}
            <span className="font-display text-sm sm:text-base font-light italic text-text/80">
              {paintingsData[nearestPainting.index].label}
            </span>
            {/* Click hint with animated ring */}
            <div className="mt-1 flex items-center gap-2">
              <div className="relative w-5 h-5">
                <div className="absolute inset-0 rounded-full border border-gold/30 animate-ping" style={{ animationDuration: '2s' }} />
                <div className="absolute inset-[3px] rounded-full border border-gold/50" />
                <div className="absolute inset-[6px] rounded-full bg-gold/30" />
              </div>
              <span className="text-[0.5rem] tracking-[0.25em] uppercase text-gold/40">
                Click to explore
              </span>
            </div>
          </div>
        )}

        {/* Scroll progress indicator */}
        <div className="fixed bottom-8 right-8 z-20 hidden md:flex flex-col items-center gap-2 pointer-events-none">
          <div className="w-px h-16 bg-gold/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full bg-gold/40 transition-all duration-300" id="gallery-progress" />
          </div>
          <span className="text-[0.45rem] tracking-[0.3em] uppercase text-gold/20">Scroll</span>
        </div>
      </div>

      {/* Lightbox overlay */}
      {openPainting !== null && (
        <PaintingLightbox
          painting={paintingsData[openPainting]}
          index={openPainting}
          paintings={paintingsData}
          onClose={handleClose}
          onNavigate={handleNavigate}
        />
      )}
    </>
  )
}
