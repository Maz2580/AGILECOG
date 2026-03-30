'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, Check } from 'lucide-react'
import type { SiteSettings } from '@/types'

const defaultSettings: SiteSettings = {
  hero_tagline: 'Architecture That Defines Tomorrow.',
  hero_sub: 'We design spaces that transcend function.',
  projects_count: '240',
  awards_count: '42',
  countries_count: '18',
  years_count: '16',
  studio_email: 'hello@agilecog.fyi',
  studio_phone: '',
  studio_address: '',
  instagram: '',
  linkedin: '',
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

        {/* Stats */}
        <div className="bg-bg2 border border-border rounded-xl p-6 space-y-6">
          <h2 className="font-display text-lg font-light text-text">Stats Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="admin-label">Projects</label>
              <input
                value={settings.projects_count}
                onChange={(e) => update('projects_count', e.target.value)}
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">Awards</label>
              <input
                value={settings.awards_count}
                onChange={(e) => update('awards_count', e.target.value)}
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">Countries</label>
              <input
                value={settings.countries_count}
                onChange={(e) => update('countries_count', e.target.value)}
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">Years</label>
              <input
                value={settings.years_count}
                onChange={(e) => update('years_count', e.target.value)}
                className="admin-input"
              />
            </div>
          </div>
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
              placeholder="Level 12, 123 Collins Street&#10;Melbourne VIC 3000"
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
