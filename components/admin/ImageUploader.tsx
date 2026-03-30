'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
  bucket?: string
  label?: string
}

export default function ImageUploader({
  value,
  onChange,
  bucket = 'project-images',
  label = 'Cover Image',
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const supabase = createClient()

  const uploadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return

    setUploading(true)
    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`

    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, { upsert: true })

    if (!error) {
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName)
      onChange(publicUrl)
    }

    setUploading(false)
  }, [bucket, onChange, supabase.storage])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) uploadFile(file)
  }, [uploadFile])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
  }

  return (
    <div>
      <label className="admin-label">{label}</label>

      {value ? (
        <div className="relative rounded-lg overflow-hidden bg-bg border border-border">
          <Image
            src={value}
            alt="Upload preview"
            width={600}
            height={400}
            className="w-full h-48 object-cover"
          />
          <button
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white hover:bg-red-500/80 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            dragOver ? 'border-gold bg-gold/5' : 'border-border hover:border-white/20'
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id={`upload-${label}`}
          />
          <label htmlFor={`upload-${label}`} className="cursor-pointer">
            {uploading ? (
              <Loader2 className="mx-auto text-gold animate-spin" size={24} />
            ) : (
              <Upload className="mx-auto text-mid" size={24} />
            )}
            <p className="text-sm text-mid mt-3">
              {uploading ? 'Uploading...' : 'Drop image here or click to browse'}
            </p>
            <p className="text-xs text-mid/50 mt-1">JPEG, WebP, PNG — max 10MB</p>
          </label>
        </div>
      )}
    </div>
  )
}
