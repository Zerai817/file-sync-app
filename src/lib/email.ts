interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "SyncFlow <onboarding@resend.dev>";

  if (!apiKey) {
    console.log("[Email skipped — no RESEND_API_KEY]", { to, subject });
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html }),
    });

    if (!res.ok) {
      console.error("Email send failed:", await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("Email error:", err);
    return false;
  }
}

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "http://localhost:3000";
}

export async function sendPasswordResetEmail(
  email: string,
  token: string,
  locale = "en"
): Promise<boolean> {
  const baseUrl = getAppUrl();
  const resetUrl = `${baseUrl}/${locale}/reset-password?token=${token}`;

  const subjects: Record<string, string> = {
    en: "Reset your SyncFlow password",
    fr: "Réinitialiser votre mot de passe SyncFlow",
    ar: "إعادة تعيين كلمة مرور SyncFlow",
  };

  const bodies: Record<string, string> = {
    en: `<p>Click the link below to reset your password. This link expires in 1 hour.</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>If you didn't request this, ignore this email.</p>`,
    fr: `<p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe. Ce lien expire dans 1 heure.</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
    ar: `<p dir="rtl">انقر على الرابط أدناه لإعادة تعيين كلمة المرور. ينتهي هذا الرابط خلال ساعة.</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
  };

  return sendEmail({
    to: email,
    subject: subjects[locale] || subjects.en,
    html: bodies[locale] || bodies.en,
  });
}
