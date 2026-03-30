'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface PublishToggleProps {
  projectId: string
  published: boolean
  slug: string
}

export default function PublishToggle({ projectId, published, slug }: PublishToggleProps) {
  const [isPublished, setIsPublished] = useState(published)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const toggle = async () => {
    setLoading(true)
    const newVal = !isPublished
    const { error } = await supabase
      .from('projects')
      .update({ published: newVal })
      .eq('id', projectId)

    if (!error) {
      setIsPublished(newVal)
      // Trigger ISR revalidation
      fetch(`/api/revalidate?path=/projects/${slug}`, { method: 'POST' })
      fetch('/api/revalidate?path=/projects', { method: 'POST' })
      fetch('/api/revalidate?path=/', { method: 'POST' })
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
        isPublished ? 'bg-green-500/30' : 'bg-white/10'
      }`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200 ${
          isPublished ? 'left-[22px] bg-green-400' : 'left-0.5 bg-mid'
        }`}
      />
    </button>
  )
}
