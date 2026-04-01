import { BrevoClient } from '@getbrevo/brevo';

export async function sendEmail({ to, subject, html }) {
  if (!process.env.BREVO_API_KEY) {
    console.log(`[Email Mock] To: ${to}, Subject: ${subject}`);
    return { id: 'mock_' + Date.now() };
  }

  try {
    const brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY });
    const result = await brevo.transactionalEmails.sendTransacEmail({
      sender: { name: 'Karriere-Institut', email: 'noreply@daskarriereinstitut.de' },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    });
    return { id: result?.messageId || 'sent' };
  } catch (error) {
    console.error('Email send failed:', error);
    return { error: error.message };
  }
}
