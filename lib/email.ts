import nodemailer from 'nodemailer'

const shootLabels: Record<string, string> = {
  'match-day': 'Match day coverage',
  portrait: 'Athlete portraits',
  content: 'Social media content',
  brand: 'Brand or sponsor shoot',
  other: 'Something else',
}

export type ContactPayload = {
  name: string
  email: string
  shoot: string
  message: string
}

export function isEmailConfigured() {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASSWORD?.trim() &&
      process.env.CONTACT_EMAIL?.trim(),
  )
}

function createTransport() {
  const port = Number(process.env.SMTP_PORT?.trim() || 587)
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST!.trim(),
    port,
    secure: process.env.SMTP_SECURE?.trim() === 'true' || port === 465,
    auth: {
      user: process.env.SMTP_USER!.trim(),
      pass: process.env.SMTP_PASSWORD!.trim(),
    },
  })
}

export async function sendContactEmail(payload: ContactPayload) {
  if (!isEmailConfigured()) {
    throw new Error('Email is not configured')
  }

  const shoot =
    shootLabels[payload.shoot] ?? payload.shoot ?? 'Not specified'
  const from = (process.env.SMTP_FROM || process.env.SMTP_USER)!.trim()
  const to = process.env.CONTACT_EMAIL!.trim()
  const cc = process.env.EMAIL_CC?.trim() || undefined

  const transport = createTransport()

  const info = await transport.sendMail({
    from: `"Harry Visuals website" <${from}>`,
    to,
    cc,
    replyTo: payload.email,
    subject: `New shoot enquiry from ${payload.name}`,
    text: [
      'New enquiry from the Harry Visuals website',
      '',
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      `Shoot type: ${shoot}`,
      '',
      'Message:',
      payload.message,
    ].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
        <h2 style="margin: 0 0 16px;">New shoot enquiry</h2>
        <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
        <p><strong>Email:</strong> <a href="mailto:${escapeHtml(payload.email)}">${escapeHtml(payload.email)}</a></p>
        <p><strong>Shoot type:</strong> ${escapeHtml(shoot)}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${escapeHtml(payload.message)}</p>
      </div>
    `,
  })

  console.log('[contact] sent', {
    to,
    cc,
    messageId: info.messageId,
    response: info.response,
  })
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}
