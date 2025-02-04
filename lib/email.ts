import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendInviteEmail({ 
  email, 
  inviteUrl 
}: { 
  email: string
  inviteUrl: string 
}) {
  await resend.emails.send({
    from: 'Perfect Program <noreply@perfect-program.com>',
    to: email,
    subject: 'You\'ve been invited to Perfect Program',
    html: `
      <h1>Welcome to Perfect Program!</h1>
      <p>You've been invited to join Perfect Program. Click the link below to get started:</p>
      <a href="${inviteUrl}">Accept Invite</a>
    `
  })
} 