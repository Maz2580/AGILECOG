import { NextResponse } from 'next/server'
import { contactSchema } from '@/lib/validators'
import { sendContactEmail } from '@/lib/resend'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = contactSchema.parse(body)

    // Save to database
    const supabase = createServiceRoleClient()
    const { error: dbError } = await supabase.from('enquiries').insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      project_type: data.project_type || null,
      message: data.message,
      status: 'new',
    })

    if (dbError) {
      console.error('DB error:', dbError)
      return NextResponse.json({ error: 'Failed to save enquiry' }, { status: 500 })
    }

    // Send email notification
    try {
      await sendContactEmail({
        name: data.name,
        email: data.email,
        phone: data.phone,
        projectType: data.project_type,
        message: data.message,
      })
    } catch (emailErr) {
      // Log but don't fail — the enquiry is saved
      console.error('Email send error:', emailErr)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact error:', err)
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}
