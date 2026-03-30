'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { projectSchema, type ProjectFormData } from '@/lib/validators'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { slugify } from '@/lib/utils'
import ImageUploader from '@/components/admin/ImageUploader'
import MultiImageUploader from '@/components/admin/MultiImageUploader'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import Link from 'next/link'
import type { Project } from '@/types'

interface ProjectFormPageProps {
  project?: Project
}

export default function ProjectFormPage({ project }: ProjectFormPageProps) {
  const isEditing = !!project
  const router = useRouter()
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [coverUrl, setCoverUrl] = useState(project?.cover_url || '')
  const [galleryImages, setGalleryImages] = useState<string[]>(project?.images || [])

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || '',
      slug: project?.slug || '',
      subtitle: project?.subtitle || '',
      category: project?.category || 'Residential',
      location: project?.location || '',
      year: project?.year || new Date().getFullYear(),
      description: project?.description || '',
      story: project?.story || '',
      featured: project?.featured || false,
      published: project?.published || false,
      sort_order: project?.sort_order || 0,
    },
  })

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setValue('title', val)
    if (!isEditing) {
      setValue('slug', slugify(val))
    }
  }

  const onSubmit = async (data: ProjectFormData) => {
    setSaving(true)
    const payload = {
      ...data,
      cover_url: coverUrl || null,
      images: galleryImages,
    }

    if (isEditing) {
      const { error } = await supabase
        .from('projects')
        .update(payload)
        .eq('id', project.id)

      if (!error) {
        fetch(`/api/revalidate?path=/projects/${data.slug}`, { method: 'POST' })
        fetch('/api/revalidate?path=/projects', { method: 'POST' })
        fetch('/api/revalidate?path=/', { method: 'POST' })
        router.push('/admin/projects')
        router.refresh()
      }
    } else {
      const { error } = await supabase.from('projects').insert(payload)
      if (!error) {
        fetch('/api/revalidate?path=/projects', { method: 'POST' })
        fetch('/api/revalidate?path=/', { method: 'POST' })
        router.push('/admin/projects')
        router.refresh()
      }
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project?')) return
    setDeleting(true)
    const { error } = await supabase.from('projects').delete().eq('id', project!.id)
    if (!error) {
      fetch('/api/revalidate?path=/projects', { method: 'POST' })
      fetch('/api/revalidate?path=/', { method: 'POST' })
      router.push('/admin/projects')
      router.refresh()
    }
    setDeleting(false)
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/projects" className="text-mid hover:text-text transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-display text-3xl font-light text-text">
            {isEditing ? 'Edit Project' : 'New Project'}
          </h1>
          {isEditing && <p className="text-sm text-mid mt-1">{project.title}</p>}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-bg2 border border-border rounded-xl p-6 space-y-6">
          <h2 className="font-display text-lg font-light text-text">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="admin-label">Title *</label>
              <input
                {...register('title')}
                onChange={handleTitleChange}
                className="admin-input"
                placeholder="The Meridian Towers"
              />
              {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="admin-label">Slug *</label>
              <input {...register('slug')} className="admin-input" placeholder="the-meridian-towers" />
              {errors.slug && <p className="text-red-400 text-xs mt-1">{errors.slug.message}</p>}
            </div>

            <div>
              <label className="admin-label">Subtitle</label>
              <input {...register('subtitle')} className="admin-input" placeholder="A new vision in urban living" />
            </div>

            <div>
              <label className="admin-label">Category *</label>
              <select {...register('category')} className="admin-input">
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Cultural">Cultural</option>
                <option value="Hospitality">Hospitality</option>
                <option value="Public">Public</option>
              </select>
            </div>

            <div>
              <label className="admin-label">Location *</label>
              <input {...register('location')} className="admin-input" placeholder="Melbourne, Australia" />
              {errors.location && <p className="text-red-400 text-xs mt-1">{errors.location.message}</p>}
            </div>

            <div>
              <label className="admin-label">Year *</label>
              <input
                type="number"
                {...register('year', { valueAsNumber: true })}
                className="admin-input"
              />
            </div>
          </div>

          <div>
            <label className="admin-label">Short Description</label>
            <textarea
              {...register('description')}
              className="admin-input resize-none h-24"
              placeholder="Brief overview for project cards..."
            />
          </div>

          <div>
            <label className="admin-label">Full Story</label>
            <textarea
              {...register('story')}
              className="admin-input resize-none h-48"
              placeholder="Long-form narrative about this project..."
            />
          </div>
        </div>

        {/* Images */}
        <div className="bg-bg2 border border-border rounded-xl p-6 space-y-6">
          <h2 className="font-display text-lg font-light text-text">Images</h2>
          <ImageUploader value={coverUrl} onChange={setCoverUrl} />
          <MultiImageUploader value={galleryImages} onChange={setGalleryImages} />
        </div>

        {/* Visibility */}
        <div className="bg-bg2 border border-border rounded-xl p-6 space-y-6">
          <h2 className="font-display text-lg font-light text-text">Visibility</h2>

          <div className="flex flex-col sm:flex-row gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('featured')}
                className="w-4 h-4 accent-gold"
              />
              <span className="text-sm text-text">Featured on homepage</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('published')}
                className="w-4 h-4 accent-gold"
              />
              <span className="text-sm text-text">Published (visible to public)</span>
            </label>
          </div>

          <div className="w-32">
            <label className="admin-label">Sort Order</label>
            <input
              type="number"
              {...register('sort_order', { valueAsNumber: true })}
              className="admin-input"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="btn-gold flex items-center gap-2"
            >
              <Save size={16} />
              {saving ? 'Saving...' : isEditing ? 'Update Project' : 'Create Project'}
            </button>
            <Link href="/admin/projects" className="btn-ghost">
              Cancel
            </Link>
          </div>

          {isEditing && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="text-red-400/70 hover:text-red-400 text-sm flex items-center gap-2 transition-colors"
            >
              <Trash2 size={14} />
              {deleting ? 'Deleting...' : 'Delete Project'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
