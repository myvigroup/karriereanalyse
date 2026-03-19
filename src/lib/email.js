import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function sendEmail({ to, subject, html }) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_PLACEHOLDER') {
    console.log(`[Email Mock] To: ${to}, Subject: ${subject}`);
    return { id: 'mock_' + Date.now() };
  }

  try {
    const result = await resend.emails.send({
      from: 'Karriere-Institut <noreply@daskarriereinstitut.de>',
      to,
      subject,
      html,
    });
    return result;
  } catch (error) {
    console.error('Email send failed:', error);
    return { error: error.message };
  }
}
