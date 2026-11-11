export interface NewsletterTemplateOptions {
  headline: string;
  contentText: string;
  ctaText: string;
  ctaLink: string;
  unsubscribeUrl: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderContent(contentText: string): string {
  const sections: string[] = [];
  let bulletItems: string[] = [];

  const flushBullets = () => {
    if (bulletItems.length === 0) return;

    sections.push(
      `<ul dir="auto" style="margin:0;padding:0 0 0 22px;color:#E0E0E0;text-align:left;">${bulletItems
        .map(
          (item) =>
            `<li dir="auto" style="padding:0 0 9px 4px;color:#E0E0E0;font-size:15px;line-height:1.75;text-align:left;">${escapeHtml(item)}</li>`
        )
        .join('')}</ul>`
    );
    bulletItems = [];
  };

  for (const line of contentText.split(/\r?\n/)) {
    const trimmedLine = line.trim();
    const bulletMatch = trimmedLine.match(/^(?:[-*•]|\d+[.)])\s+(.+)$/);

    if (bulletMatch) {
      bulletItems.push(bulletMatch[1]);
      continue;
    }

    flushBullets();
    if (trimmedLine) {
      sections.push(
        `<p dir="auto" style="margin:0 0 16px;color:#E0E0E0;font-size:15px;line-height:1.85;text-align:left;">${escapeHtml(trimmedLine)}</p>`
      );
    }
  }

  flushBullets();
  return sections.join('');
}

export function renderNewsletterTemplate({
  headline,
  contentText,
  ctaText,
  ctaLink,
  unsubscribeUrl,
}: NewsletterTemplateOptions): string {
  const safeCtaLink = escapeHtml(ctaLink);
  const safeHeadline = escapeHtml(headline);
  const safeUnsubscribeUrl = escapeHtml(unsubscribeUrl);

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="dark">
    <meta name="supported-color-schemes" content="dark">
    <title>${safeHeadline}</title>
    <style>
      @media only screen and (max-width:620px) {
        .email-outer { padding:18px 10px !important; }
        .email-shell { width:100% !important; }
        .email-gutter { padding-left:22px !important; padding-right:22px !important; }
        .email-headline { font-size:27px !important; line-height:1.3 !important; }
        .email-logo { max-width:120px !important; }
      }
    </style>
  </head>
  <body style="width:100%;margin:0;padding:0;background-color:#073B2A;font-family:Arial,Helvetica,sans-serif;color:#FFFFFF;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
    <div style="display:none;font-size:1px;color:#073B2A;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
      ${safeHeadline} — Egyptian botanicals and export updates from Nilorigen Botanicals.
    </div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#073B2A" style="width:100%;background-color:#073B2A;">
      <tr>
        <td class="email-outer" align="center" style="padding:38px 16px;">
          <table role="presentation" class="email-shell" width="600" cellspacing="0" cellpadding="0" border="0" bgcolor="#0A3F2E" style="width:100%;max-width:600px;background-color:#0A3F2E;border:1px solid #285441;border-radius:12px;overflow:hidden;">
            <tr>
              <td class="email-gutter" align="center" style="padding:38px 48px 27px;">
                <img src="https://nilorigen.com/logo.png" alt="Nilorigen Botanicals" width="140" class="email-logo" style="max-width:140px;height:auto;display:block;margin:0 auto;border:0;outline:none;text-decoration:none;" />
                <p style="margin:12px 0 0;color:#D4AF37;font-family:Georgia,'Times New Roman',serif;font-size:20px;font-weight:bold;letter-spacing:3px;line-height:1.4;text-align:center;">NILORIGEN BOTANICALS</p>
                <p style="margin:7px 0 0;color:#E0E0E0;font-size:9px;font-weight:bold;letter-spacing:2px;line-height:1.7;text-align:center;">EGYPTIAN BOTANICALS &bull; GLOBAL REACH</p>
              </td>
            </tr>
            <tr>
              <td class="email-gutter" style="padding:0 48px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr><td height="1" bgcolor="#D4AF37" style="height:1px;background-color:#D4AF37;font-size:0;line-height:0;">&nbsp;</td></tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="email-gutter" style="padding:34px 48px 15px;">
                <h1 class="email-headline" dir="auto" style="margin:0 0 22px;color:#FFFFFF;font-family:Georgia,'Times New Roman',serif;font-size:32px;font-weight:normal;line-height:1.35;text-align:left;">${safeHeadline}</h1>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#0D4935" style="width:100%;background-color:#0D4935;border:1px solid #D4AF37;border-radius:8px;">
                  <tr>
                    <td dir="auto" style="padding:22px 22px 7px;text-align:left;">
                      <p style="margin:0 0 14px;color:#D4AF37;font-size:10px;font-weight:bold;letter-spacing:1.8px;line-height:1.5;text-align:left;">HARVEST &amp; PRODUCT UPDATE</p>
                      ${renderContent(contentText)}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="email-gutter" align="center" style="padding:22px 48px 39px;">
                <!--[if mso]>
                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${safeCtaLink}" style="height:50px;v-text-anchor:middle;width:250px;" arcsize="12%" strokecolor="#D4AF37" fillcolor="#D4AF37">
                  <w:anchorlock/>
                  <center style="color:#073B2A;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;">${escapeHtml(ctaText)}</center>
                </v:roundrect>
                <![endif]-->
                <!--[if !mso]><!-->
                <a href="${safeCtaLink}" target="_blank" style="display:inline-block;min-width:190px;padding:17px 28px;background-color:#D4AF37;border:1px solid #D4AF37;border-radius:5px;color:#073B2A;font-size:14px;font-weight:bold;line-height:16px;text-align:center;text-decoration:none;">${escapeHtml(ctaText)}</a>
                <!--<![endif]-->
              </td>
            </tr>
            <tr>
              <td class="email-gutter" style="padding:0 48px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr><td height="1" bgcolor="#D4AF37" style="height:1px;background-color:#D4AF37;font-size:0;line-height:0;">&nbsp;</td></tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="email-gutter" style="padding:26px 48px 32px;">
                <p style="margin:0 0 13px;color:#D4AF37;font-size:10px;font-weight:bold;letter-spacing:1.7px;line-height:1.6;">NILORIGEN BOTANICALS &bull; EXPORT DESK</p>
                <p dir="auto" style="margin:0 0 7px;color:#E0E0E0;font-size:12px;line-height:1.8;">Headquarters: Cairo, Egypt &bull; المقر الرئيسي: القاهرة، مصر</p>
                <p style="margin:0 0 7px;color:#E0E0E0;font-size:12px;line-height:1.8;">Export Desk: <a href="mailto:export@nilorigen.com" style="color:#D4AF37;text-decoration:underline;">export@nilorigen.com</a></p>
                <p style="margin:0 0 16px;color:#E0E0E0;font-size:12px;line-height:1.8;">WhatsApp Desk: <a href="https://wa.me/201064410615" style="color:#D4AF37;text-decoration:underline;">+20 106 441 0615</a></p>
                <p dir="auto" style="margin:0;color:#A9B8B0;font-size:11px;line-height:1.8;">You are receiving this email because you subscribed to Nilorigen Botanicals updates. <a href="${safeUnsubscribeUrl}" style="color:#D4AF37;text-decoration:underline;">Unsubscribe from these updates</a> or <a href="mailto:export@nilorigen.com?subject=Unsubscribe" style="color:#D4AF37;text-decoration:underline;">contact our export desk</a>. لتعديل الاشتراك أو إلغائه، يرجى استخدام رابط إلغاء الاشتراك أو التواصل مع فريق التصدير.</p>
              </td>
            </tr>
          </table>
          <p style="margin:17px 0 0;color:#A9B8B0;font-size:10px;line-height:1.7;text-align:center;">&copy; ${new Date().getFullYear()} Nilorigen Botanicals. All rights reserved.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function renderNewsletterText({
  headline,
  contentText,
  ctaText,
  ctaLink,
  unsubscribeUrl,
}: NewsletterTemplateOptions): string {
  return [
    headline,
    '',
    contentText,
    '',
    `${ctaText}: ${ctaLink}`,
    '',
    `Unsubscribe: ${unsubscribeUrl}`,
    'Nilorigen Botanicals Export Desk',
    'export@nilorigen.com',
  ].join('\n');
}
