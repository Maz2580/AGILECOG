import { Resend } from 'resend'

function getResendClient() {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY is not set')
  return new Resend(key)
}

interface ContactEmailProps {
  name: string
  email: string
  phone?: string
  projectType?: string
  message: string
}

export async function sendContactEmail(data: ContactEmailProps) {
  const resend = getResendClient()
  const { error } = await resend.emails.send({
    from: 'AGILECOG <noreply@agilecog.fyi>',
    to: process.env.CONTACT_EMAIL_TO!,
    replyTo: data.email,
    subject: `New Enquiry from ${data.name}${data.projectType ? ` — ${data.projectType}` : ''}`,
    html: `
      <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #F0E8D8; padding: 48px 32px;">
        <h1 style="font-size: 14px; letter-spacing: 0.3em; text-transform: uppercase; color: #C4A45A; margin-bottom: 32px;">New Enquiry</h1>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.07); color: #7a7a7a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em; width: 120px;">Name</td>
            <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.07); color: #F0E8D8;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.07); color: #7a7a7a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em;">Email</td>
            <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.07); color: #F0E8D8;"><a href="mailto:${data.email}" style="color: #C4A45A;">${data.email}</a></td>
          </tr>
          ${data.phone ? `
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.07); color: #7a7a7a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em;">Phone</td>
            <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.07); color: #F0E8D8;">${data.phone}</td>
          </tr>` : ''}
          ${data.projectType ? `
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.07); color: #7a7a7a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em;">Type</td>
            <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.07); color: #F0E8D8;">${data.projectType}</td>
          </tr>` : ''}
        </table>

        <div style="margin-top: 32px; padding: 24px; background: rgba(255,255,255,0.03); border-left: 2px solid #C4A45A;">
          <p style="margin: 0; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; color: #7a7a7a; margin-bottom: 12px;">Message</p>
          <p style="margin: 0; line-height: 1.8; color: #F0E8D8;">${data.message.replace(/\n/g, '<br>')}</p>
        </div>

        <p style="margin-top: 48px; font-size: 11px; color: #7a7a7a; letter-spacing: 0.15em;">AGILECOG &mdash; Architecture Studio</p>
      </div>
    `,
  })

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`)
  }
}
