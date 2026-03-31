'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, Check, Image as ImageIcon } from 'lucide-react'
import type { SiteSettings } from '@/types'

const galleryDefaults = [
  { label: 'Marble & Light', room: 'Bathroom' },
  { label: 'Stone & Craft', room: 'Kitchen' },
  { label: 'Warmth & Rest', room: 'Bedroom' },
  { label: 'Form & Function', room: 'Wardrobe' },
  { label: 'Timber & Glow', room: 'Joinery' },
  { label: 'Detail & Finish', room: 'Kitchen Detail' },
  { label: 'Light & Space', room: 'Master Suite' },
]

const defaultSettings: SiteSettings = {
  hero_tagline: 'Architecture That Defines Tomorrow.',
  hero_sub: 'We design spaces that transcend function.',
  studio_email: 'hello@agilecog.fyi',
  studio_phone: '',
  studio_address: '',
  instagram: '',
  linkedin: '',
  gallery_painting_1_label: galleryDefaults[0].label,
  gallery_painting_1_room: galleryDefaults[0].room,
  gallery_painting_2_label: galleryDefaults[1].label,
  gallery_painting_2_room: galleryDefaults[1].room,
  gallery_painting_3_label: galleryDefaults[2].label,
  gallery_painting_3_room: galleryDefaults[2].room,
  gallery_painting_4_label: galleryDefaults[3].label,
  gallery_painting_4_room: galleryDefaults[3].room,
  gallery_painting_5_label: galleryDefaults[4].label,
  gallery_painting_5_room: galleryDefaults[4].room,
  gallery_painting_6_label: galleryDefaults[5].label,
  gallery_painting_6_room: galleryDefaults[5].room,
  gallery_painting_7_label: galleryDefaults[6].label,
  gallery_painting_7_room: galleryDefaults[6].room,
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('settings').select('*')
      if (data) {
        const map: Record<string, string> = {}
        data.forEach((row: { key: string; value: string }) => {
          map[row.key] = row.value
        })
        setSettings((prev) => ({ ...prev, ...map }))
      }
    }
    load()
  }, [supabase])

  const handleSave = async () => {
    setSaving(true)
    const entries = Object.entries(settings)

    for (const [key, value] of entries) {
      await supabase
        .from('settings')
        .upsert({ key, value: value || '' }, { onConflict: 'key' })
    }

    // Trigger revalidation
    fetch('/api/revalidate?path=/', { method: 'POST' })

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const update = (key: keyof SiteSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-light text-text">Site Settings</h1>
          <p className="text-sm text-mid mt-1">Global configuration for AGILECOG</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-gold flex items-center gap-2"
        >
          {saved ? <Check size={16} /> : <Save size={16} />}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-8">
        {/* Hero Section */}
        <div className="bg-bg2 border border-border rounded-xl p-6 space-y-6">
          <h2 className="font-display text-lg font-light text-text">Hero Section</h2>

          <div>
            <label className="admin-label">Main Tagline</label>
            <input
              value={settings.hero_tagline}
              onChange={(e) => update('hero_tagline', e.target.value)}
              className="admin-input"
            />
          </div>

          <div>
            <label className="admin-label">Sub-headline</label>
            <input
              value={settings.hero_sub}
              onChange={(e) => update('hero_sub', e.target.value)}
              className="admin-input"
            />
          </div>
        </div>

        {/* Gallery Paintings */}
        <div className="bg-bg2 border border-border rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <ImageIcon size={18} className="text-gold" />
            <div>
              <h2 className="font-display text-lg font-light text-text">Gallery Paintings</h2>
              <p className="text-xs text-mid/60 mt-0.5">Labels shown beneath each painting in the 3D gallery walkthrough</p>
            </div>
          </div>

          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6, 7].map((n) => {
              const labelKey = `gallery_painting_${n}_label` as keyof SiteSettings
              const roomKey = `gallery_painting_${n}_room` as keyof SiteSettings
              return (
                <div key={n} className="grid grid-cols-[32px_1fr_1fr] gap-3 items-end">
                  <div className="flex items-center justify-center h-10 rounded bg-gold/[0.06] text-gold/40 text-xs font-display">
                    {n}
                  </div>
                  <div>
                    <label className="admin-label text-[0.6rem]">Title</label>
                    <input
                      value={settings[labelKey]}
                      onChange={(e) => update(labelKey, e.target.value)}
                      className="admin-input text-sm"
                      placeholder="e.g. Marble & Light"
                    />
                  </div>
                  <div>
                    <label className="admin-label text-[0.6rem]">Room Type</label>
                    <input
                      value={settings[roomKey]}
                      onChange={(e) => update(roomKey, e.target.value)}
                      className="admin-input text-sm"
                      placeholder="e.g. Bathroom"
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <p className="text-[0.6rem] text-mid/30 mt-2">
            To change the gallery images, replace the files in <code className="text-gold/40">public/images/</code> and redeploy.
          </p>
        </div>

        {/* Contact */}
        <div className="bg-bg2 border border-border rounded-xl p-6 space-y-6">
          <h2 className="font-display text-lg font-light text-text">Contact Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="admin-label">Studio Email</label>
              <input
                value={settings.studio_email}
                onChange={(e) => update('studio_email', e.target.value)}
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">Phone</label>
              <input
                value={settings.studio_phone}
                onChange={(e) => update('studio_phone', e.target.value)}
                className="admin-input"
                placeholder="+61 3 9000 0000"
              />
            </div>
          </div>

          <div>
            <label className="admin-label">Address</label>
            <textarea
              value={settings.studio_address}
              onChange={(e) => update('studio_address', e.target.value)}
              className="admin-input resize-none h-20"
              placeholder={"Level 12, 123 Collins Street\nMelbourne VIC 3000"}
            />
          </div>
        </div>

        {/* Social */}
        <div className="bg-bg2 border border-border rounded-xl p-6 space-y-6">
          <h2 className="font-display text-lg font-light text-text">Social Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="admin-label">Instagram URL</label>
              <input
                value={settings.instagram}
                onChange={(e) => update('instagram', e.target.value)}
                className="admin-input"
                placeholder="https://instagram.com/agilecog"
              />
            </div>
            <div>
              <label className="admin-label">LinkedIn URL</label>
              <input
                value={settings.linkedin}
                onChange={(e) => update('linkedin', e.target.value)}
                className="admin-input"
                placeholder="https://linkedin.com/company/agilecog"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
