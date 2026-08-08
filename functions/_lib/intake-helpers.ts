/** Server-side intake helpers for Cloudflare Pages Functions. */

export const CANONICAL_TOPICS = [
  'general',
  'tech-talk',
  'sponsorship',
  'collaboration',
  'the-library-of-tomorrow',
  'press',
  'conduct',
  'other',
] as const;

export const CFS_FORMATS = [
  'regular',
  'lightning',
  'panel',
  'workshop',
] as const;

export const SPONSOR_TIERS = [
  'diamond',
  'gold',
  'silver',
  'bronze',
  'community',
  'unsure',
] as const;

export const CONTRIBUTION_TYPES = ['cash', 'in-kind', 'both', 'unsure'] as const;

const TOPIC_ALIASES: Record<string, string> = {
  project: 'sponsorship',
  sponsor: 'sponsorship',
  sponsorship: 'sponsorship',
  speaker: 'tech-talk',
  'tech-talk': 'tech-talk',
  cfs: 'tech-talk',
  press: 'press',
  media: 'press',
  conduct: 'conduct',
  coc: 'conduct',
  collaboration: 'collaboration',
  general: 'general',
  other: 'other',
  'the-library-of-tomorrow': 'the-library-of-tomorrow',
};

export function normalizeTopic(raw: string | null | undefined): string {
  if (!raw) return '';
  const key = raw.trim().toLowerCase();
  return TOPIC_ALIASES[key] ?? key;
}

export function looksLikeSpamPayload(fields: {
  name: string;
  message: string;
  website?: string;
}): boolean {
  if (fields.website?.trim()) return true;
  const urlPattern = /https?:\/\//gi;
  if (fields.name.match(urlPattern)?.length) return true;
  if ((fields.message.match(urlPattern) || []).length > 6) return true;
  return false;
}

export function checkRateLimit(
  store: Map<string, number[]>,
  key: string,
  limit: number,
  windowMs: number,
  now = Date.now()
): { allowed: boolean; retryAfterSec: number } {
  const cutoff = now - windowMs;
  const prior = (store.get(key) || []).filter((ts) => ts > cutoff);
  if (prior.length >= limit) {
    const retryAfterSec = Math.max(
      1,
      Math.ceil((prior[0] + windowMs - now) / 1000)
    );
    store.set(key, prior);
    return { allowed: false, retryAfterSec };
  }
  prior.push(now);
  store.set(key, prior);
  return { allowed: true, retryAfterSec: 0 };
}

export function pickAckCopy(
  topic: string,
  lang: 'en' | 'es'
): { subject: string; text: string } {
  const t = normalizeTopic(topic) || 'general';
  if (lang === 'es') {
    const subjects: Record<string, string> = {
      'tech-talk': 'Recibimos tu postulación — Pereira Tech Talks',
      sponsorship: 'Recibimos tu consulta de patrocinio — Pereira Tech Talks',
      press: 'Recibimos tu consulta de prensa — Pereira Tech Talks',
      conduct: 'Recibimos tu reporte — Pereira Tech Talks',
      general: 'Recibimos tu mensaje — Pereira Tech Talks',
    };
    const bodies: Record<string, string> = {
      'tech-talk':
        'Gracias por postular tu charla. Revisamos propuestas continuamente y te respondemos en un máximo de 7 días hábiles para alinear fecha y formato.\n\n— Pereira Tech Talks',
      sponsorship:
        'Gracias por tu interés en patrocinar Pereira Tech Talks. Un organizador te contactará en un máximo de 5 días hábiles.\n\n— Pereira Tech Talks',
      press:
        'Gracias por escribirnos. El equipo de prensa revisará tu consulta y responderá lo antes posible.\n\n— Pereira Tech Talks',
      conduct:
        'Gracias por contactarnos. Tu mensaje será tratado con confidencialidad por el equipo de conducta.\n\n— Pereira Tech Talks',
      general:
        'Gracias por escribirnos. Te responderemos tan pronto como podamos.\n\n— Pereira Tech Talks',
    };
    return {
      subject: subjects[t] || subjects.general,
      text: bodies[t] || bodies.general,
    };
  }
  const subjects: Record<string, string> = {
    'tech-talk': 'We received your talk proposal — Pereira Tech Talks',
    sponsorship: 'We received your sponsorship inquiry — Pereira Tech Talks',
    press: 'We received your press inquiry — Pereira Tech Talks',
    conduct: 'We received your report — Pereira Tech Talks',
    general: 'We received your message — Pereira Tech Talks',
  };
  const bodies: Record<string, string> = {
    'tech-talk':
      'Thanks for submitting your talk. We review proposals year-round and reply within 7 business days.\n\n— Pereira Tech Talks',
    sponsorship:
      'Thanks for your interest in sponsoring Pereira Tech Talks. An organizer will follow up within 5 business days.\n\n— Pereira Tech Talks',
    press:
      'Thanks for reaching out. Our press contacts will reply as soon as possible.\n\n— Pereira Tech Talks',
    conduct:
      'Thanks for contacting us. Your message will be handled confidentially by the conduct team.\n\n— Pereira Tech Talks',
    general:
      "Thanks for writing. We'll get back to you as soon as we can.\n\n— Pereira Tech Talks",
  };
  return {
    subject: subjects[t] || subjects.general,
    text: bodies[t] || bodies.general,
  };
}
