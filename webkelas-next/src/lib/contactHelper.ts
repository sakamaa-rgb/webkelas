/**
 * Contact sanitization and link formatting helpers.
 * Ensures contact links (WhatsApp, Instagram, Email) always format
 * properly regardless of how user inputs them (e.g. 08xx vs +62xx, URLs vs handles).
 */

export function formatInstagramHandle(input?: string): string {
  if (!input) return 'xpplg.3rd';
  let cleaned = input.trim();
  // Remove URL if user pasted full Instagram link
  cleaned = cleaned.replace(/^https?:\/\/(www\.)?instagram\.com\//i, '');
  // Remove leading @
  cleaned = cleaned.replace(/^@+/, '');
  // Remove trailing slashes and query params
  cleaned = cleaned.split('/')[0].split('?')[0].trim();
  return cleaned || 'xpplg.3rd';
}

export function formatInstagramUrl(input?: string): string {
  const handle = formatInstagramHandle(input);
  return `https://instagram.com/${handle}`;
}

export function formatWhatsAppNumber(input?: string): string {
  if (!input) return '6281294862060';
  let digits = input.replace(/[^0-9]/g, '');
  if (!digits) return '6281294862060';
  // Convert local Indonesian prefix 08xx to international 628xx
  if (digits.startsWith('0')) {
    digits = '62' + digits.slice(1);
  } else if (digits.startsWith('8')) {
    digits = '62' + digits;
  }
  return digits;
}

export function formatWhatsAppUrl(input?: string, message?: string): string {
  const number = formatWhatsAppNumber(input);
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${number}${text}`;
}

export function formatWhatsAppDisplay(input?: string): string {
  const num = formatWhatsAppNumber(input);
  if (num.startsWith('62')) {
    return `+62 ${num.slice(2, 5)}-${num.slice(5, 9)}-${num.slice(9)}`;
  }
  return `+${num}`;
}

export function formatEmailAddress(input?: string): string {
  if (!input) return 'classxpplg3@gmail.com';
  return input.trim().replace(/^mailto:/i, '');
}

export function formatEmailUrl(input?: string, subject?: string): string {
  const email = formatEmailAddress(input);
  const query = subject ? `?subject=${encodeURIComponent(subject)}` : '';
  return `mailto:${email}${query}`;
}
