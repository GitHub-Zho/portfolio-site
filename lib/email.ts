import { Resend } from 'resend'

// Lazy + guarded: the Resend constructor throws synchronously if no key is set.
// Constructing it at module scope would throw at import time, before any try/catch
// in the caller can run. Deferring to first use keeps "no key configured yet" a
// no-op instead of a crash.
let resend: Resend | null = null
function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY)
  return resend
}

interface BookingEmailDetails {
  name: string
  email: string
  phone: string
  message: string | null
  courseTitle: string
  date: string // formatted, e.g. "6月26日 周五"
  startTime: string
  endTime: string
}

function confirmationHtml(d: BookingEmailDetails) {
  return `
    <div style="font-family: -apple-system, sans-serif; background: #FBF6F0; padding: 32px; color: #3A2E28;">
      <h2 style="font-weight: 500;">预约收到啦，${d.name} 👋</h2>
      <p style="color: #6b5d52; line-height: 1.7;">这是你的预约信息，我会尽快联系你确认细节。</p>
      <div style="background: white; border-radius: 12px; padding: 20px; margin-top: 16px;">
        <p style="margin: 4px 0;"><strong>课程</strong>　${d.courseTitle}</p>
        <p style="margin: 4px 0;"><strong>时间</strong>　${d.date} ${d.startTime}-${d.endTime}</p>
        ${d.message ? `<p style="margin: 4px 0;"><strong>备注</strong>　${d.message}</p>` : ''}
      </div>
    </div>
  `
}

function adminNotificationHtml(d: BookingEmailDetails) {
  return `
    <div style="font-family: -apple-system, sans-serif; padding: 24px;">
      <h2>新预约：${d.courseTitle}</h2>
      <p><strong>时间</strong>　${d.date} ${d.startTime}-${d.endTime}</p>
      <p><strong>姓名</strong>　${d.name}</p>
      <p><strong>邮箱</strong>　${d.email}</p>
      <p><strong>手机</strong>　${d.phone}</p>
      ${d.message ? `<p><strong>备注</strong>　${d.message}</p>` : ''}
    </div>
  `
}

export async function sendBookingConfirmation(d: BookingEmailDetails) {
  const client = getResend()
  if (!client) {
    console.log('[email] RESEND_API_KEY not set — skipping booking confirmation email')
    return
  }
  await client.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: d.email,
    subject: `预约确认 — ${d.courseTitle}`,
    html: confirmationHtml(d),
  })
}

export async function sendAdminNotification(d: BookingEmailDetails) {
  const client = getResend()
  if (!client || !process.env.ADMIN_EMAIL) {
    console.log('[email] RESEND_API_KEY or ADMIN_EMAIL not set — skipping admin notification email')
    return
  }
  await client.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: process.env.ADMIN_EMAIL,
    subject: `新预约 — ${d.name}`,
    html: adminNotificationHtml(d),
  })
}

function statusUpdateHtml(d: BookingEmailDetails, status: 'confirmed' | 'cancelled') {
  const headline = status === 'confirmed' ? '你的预约已确认 ✅' : '你的预约已取消'
  const body =
    status === 'confirmed'
      ? '教练确认了这个时间，到时候见！'
      : '这个时间段被取消了，有疑问可以直接联系我。'
  return `
    <div style="font-family: -apple-system, sans-serif; background: #FBF6F0; padding: 32px; color: #3A2E28;">
      <h2 style="font-weight: 500;">${headline}</h2>
      <p style="color: #6b5d52; line-height: 1.7;">${body}</p>
      <div style="background: white; border-radius: 12px; padding: 20px; margin-top: 16px;">
        <p style="margin: 4px 0;"><strong>课程</strong>　${d.courseTitle}</p>
        <p style="margin: 4px 0;"><strong>时间</strong>　${d.date} ${d.startTime}-${d.endTime}</p>
      </div>
    </div>
  `
}

export async function sendBookingStatusUpdate(d: BookingEmailDetails, status: 'confirmed' | 'cancelled') {
  const client = getResend()
  if (!client) {
    console.log('[email] RESEND_API_KEY not set — skipping status update email')
    return
  }
  await client.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: d.email,
    subject: status === 'confirmed' ? `预约已确认 — ${d.courseTitle}` : `预约已取消 — ${d.courseTitle}`,
    html: statusUpdateHtml(d, status),
  })
}
