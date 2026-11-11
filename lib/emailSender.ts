const EMAIL_PATTERN = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

export interface ResendSender {
  from: string;
  email: string;
}

export function getResendSender(): ResendSender | null {
  const configuredSender = process.env.RESEND_FROM_EMAIL?.trim();
  const sender = configuredSender || (
    process.env.NODE_ENV === 'production'
      ? ''
      : 'Nilorigen Botanicals <onboarding@resend.dev>'
  );
  if (!sender || /[\r\n\u0000-\u001F\u007F]/.test(sender)) return null;

  const formattedSender = /^(?:[^<>]+\s+)?<([^<>]+)>$/.exec(sender);
  const email = formattedSender?.[1] ?? sender;
  if (!EMAIL_PATTERN.test(email)) return null;

  const senderDomain = email.split('@')[1].toLowerCase();
  if (
    process.env.NODE_ENV === 'production' &&
    senderDomain !== 'nilorigen.com' &&
    !senderDomain.endsWith('.nilorigen.com')
  ) {
    return null;
  }

  return { from: sender, email };
}
