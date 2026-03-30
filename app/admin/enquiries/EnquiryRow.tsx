'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import type { Enquiry } from '@/types'
import { ChevronDown, ChevronUp, Mail } from 'lucide-react'

const statusColors: Record<string, string> = {
  new: 'bg-gold/15 text-gold',
  read: 'bg-blue-500/15 text-blue-400',
  replied: 'bg-green-500/15 text-green-400',
  archived: 'bg-white/5 text-mid',
}

interface EnquiryRowProps {
  enquiry: Enquiry
  mobile?: boolean
}

export default function EnquiryRow({ enquiry, mobile }: EnquiryRowProps) {
  const [expanded, setExpanded] = useState(false)
  const [status, setStatus] = useState(enquiry.status)
  const supabase = createClient()
  const router = useRouter()

  const updateStatus = async (newStatus: string) => {
    const { error } = await supabase
      .from('enquiries')
      .update({ status: newStatus })
      .eq('id', enquiry.id)

    if (!error) {
      setStatus(newStatus as Enquiry['status'])
      router.refresh()
    }
  }

  if (mobile) {
    return (
      <div className="p-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-left flex items-center justify-between"
        >
          <div>
            <p className="text-sm text-text">{enquiry.name}</p>
            <p className="text-xs text-mid">{enquiry.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-block px-2 py-0.5 rounded text-[0.55rem] uppercase tracking-wider ${statusColors[status]}`}>
                {status}
              </span>
              <span className="text-[0.6rem] text-mid/50">{formatDate(enquiry.created_at)}</span>
            </div>
          </div>
          {expanded ? <ChevronUp size={16} className="text-mid" /> : <ChevronDown size={16} className="text-mid" />}
        </button>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-border space-y-4">
            {enquiry.project_type && (
              <p className="text-xs text-mid">Type: <span className="text-text">{enquiry.project_type}</span></p>
            )}
            <p className="text-sm text-mid leading-relaxed">{enquiry.message}</p>
            <div className="flex flex-wrap gap-2">
              {['new', 'read', 'replied', 'archived'].map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
                  className={`px-3 py-1.5 rounded text-[0.6rem] uppercase tracking-wider transition-colors ${
                    status === s ? statusColors[s] : 'bg-white/5 text-mid hover:text-text'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <a
              href={`mailto:${enquiry.email}`}
              className="inline-flex items-center gap-2 text-xs text-gold"
            >
              <Mail size={12} /> Reply via email
            </a>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <tr
        onClick={() => setExpanded(!expanded)}
        className="border-b border-border hover:bg-white/[0.02] transition-colors cursor-pointer"
      >
        <td className="p-4 text-sm text-text">{enquiry.name}</td>
        <td className="p-4 text-sm text-mid">{enquiry.email}</td>
        <td className="p-4 text-sm text-mid">{enquiry.project_type || '—'}</td>
        <td className="p-4 text-sm text-mid">{formatDate(enquiry.created_at)}</td>
        <td className="p-4 text-center">
          <span className={`inline-block px-2 py-0.5 rounded text-[0.6rem] uppercase tracking-wider ${statusColors[status]}`}>
            {status}
          </span>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-white/[0.01]">
          <td colSpan={5} className="p-6">
            <div className="max-w-2xl space-y-4">
              <p className="text-sm text-mid leading-relaxed">{enquiry.message}</p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[0.6rem] tracking-wider uppercase text-mid">Status:</span>
                {['new', 'read', 'replied', 'archived'].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(s)}
                    className={`px-3 py-1.5 rounded text-[0.6rem] uppercase tracking-wider transition-colors ${
                      status === s ? statusColors[s] : 'bg-white/5 text-mid hover:text-text'
                    }`}
                  >
                    {s}
                  </button>
                ))}
                <a
                  href={`mailto:${enquiry.email}`}
                  className="ml-auto inline-flex items-center gap-2 text-xs text-gold hover:text-text transition-colors"
                >
                  <Mail size={12} /> Reply
                </a>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
