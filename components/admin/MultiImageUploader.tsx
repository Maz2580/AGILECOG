'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface MultiImageUploaderProps {
  value: string[]
  onChange: (urls: string[]) => void
  bucket?: string
}

export default function MultiImageUploader({
  value,
  onChange,
  bucket = 'project-images',
}: MultiImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  const uploadFiles = useCallback(async (files: FileList) => {
    setUploading(true)
    const newUrls: string[] = []

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`

      const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { upsert: true })

      if (!error) {
        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(fileName)
        newUrls.push(publicUrl)
      }
    }

    onChange([...value, ...newUrls])
    setUploading(false)
  }, [bucket, onChange, value, supabase.storage])

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div>
      <label className="admin-label">Gallery Images</label>

      {value.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-4">
          {value.map((url, i) => (
            <div key={i} className="relative rounded-lg overflow-hidden bg-bg border border-border aspect-square">
              <Image src={url} alt={`Gallery ${i + 1}`} fill className="object-cover" />
              <button
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white hover:bg-red-500/80 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-white/20 transition-colors cursor-pointer">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
          className="hidden"
          id="gallery-upload"
        />
        <label htmlFor="gallery-upload" className="cursor-pointer">
          {uploading ? (
            <Loader2 className="mx-auto text-gold animate-spin" size={20} />
          ) : (
            <Upload className="mx-auto text-mid" size={20} />
          )}
          <p className="text-sm text-mid mt-2">
            {uploading ? 'Uploading...' : 'Add gallery images'}
          </p>
        </label>
      </div>
    </div>
  )
}
