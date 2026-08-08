/**
 * Shared helpers for POSTing form responses to the DailyBot Forms public API.
 *
 * Six PTT public intakes map to one DailyBot form each. Form and question UUIDs
 * are stable identifiers baked in here (see
 * `.dwp/plans/PLAN_dailybot_forms_integration/analysis_results/DAILYBOT_UUIDS.json`
 * and `docs/features/FORMS.md` once Task 13 lands).
 *
 * API contract:
 *   POST https://api.dailybot.com/v1/forms/{form_uuid}/responses/
 *   Header: X-API-KEY: ${DAILYBOT_API_KEY}
 *   Body:   { "content": { "<question_uuid>": <value> }, "automation": true }
 *
 * Multiple-choice note (verified Task 3 smoke): this org's GET payload returns
 * `choices[].value` equal to the label (e.g. "General"). POSTing the slugified
 * label ("general") fails with ["response is not valid"]. Choice lookups
 * therefore resolve aliases → canonical **label**, not slugify(label).
 */

// ────────────────────────────────────────────────────────────────────────────
// Form identifiers
// ────────────────────────────────────────────────────────────────────────────

export const CONTACT_FORM_UUID = 'cd036d4a-2bde-48ef-83da-3fa69d91d971';
export const CFS_FORM_UUID = '2a3b568c-9255-4d5a-a29c-8f220ae427ce';
export const SPEAKER_SCHOOL_FORM_UUID = 'a7bb66f2-082c-4d36-b687-13d4d1c5ed80';
export const SPONSORS_FORM_UUID = 'f3469d2d-df7b-4007-8ff8-e8c61de7b80d';
export const CALENDAR_FORM_UUID = '22f3540c-669d-42b8-8365-abed7bb07cda';
export const CONDUCT_FORM_UUID = 'ce944b4b-bd99-4836-a14e-c583773952a4';

export const CONTACT_Q = {
  NAME: 'b3631f67-c45f-4e04-ac74-9b6227215bab',
  EMAIL: 'dc82fc72-5da9-419e-89c6-9f659d17abbb',
  TOPIC: 'ef359c90-71ff-4c06-8e5c-64d6ba626ede',
  SUBJECT: '26ec3124-4f26-4f56-a833-b23b39f6caf1',
  MESSAGE: 'e9ee3c23-4a09-4a72-bce5-4962581f79f2',
  LANG: '98ea18f2-a9ab-4478-b820-bb15fb891d89',
  PAGE_PATH: '8a12f9fa-6bee-473f-be6e-a7a5d1d27679',
} as const;

export const CFS_Q = {
  NAME: '43a83d0b-05b2-4197-8d10-0d0f7d92c04f',
  EMAIL: '6dfb89e7-25e2-4251-b7ee-ea22fdb977a0',
  TALK_TITLE: '692d4dc5-8c70-4860-b4d9-fed3e39cb71b',
  FORMAT: 'f1a1b2af-3a58-454b-b587-80dad8a51120',
  ABSTRACT: 'c50a508d-4a55-4c54-9552-b227d5fc7567',
  TAKEAWAYS: '0fff158c-f056-40f7-83c6-16ba3f296dbb',
  SOCIAL_URL: '13779547-771a-4cf6-a859-d7e0073c95a1',
  FIRST_TIME: 'dd83b3af-7b7b-4748-ba6a-316fae3f825d',
  SPEAKER_SCHOOL: '8e518d0c-2757-4e00-ae97-eca425c476f8',
  NOTES: '9bf5d1e9-710a-4fc2-956e-a2f7d763fc2b',
  LANG: '2540a2ff-ba71-4682-9c62-c8f2731639e5',
  PAGE_PATH: '97d98089-711b-472f-8364-a639b9319ad5',
} as const;

export const SPEAKER_SCHOOL_Q = {
  NAME: 'cf612269-da43-423f-8aa3-77f37d8034f3',
  EMAIL: 'e30cc9d8-b427-4d89-ac02-60813a3d6f35',
  EXPERIENCE_LEVEL: 'abd98f0c-f3cb-4852-beae-012577892e0e',
  GOALS: 'c1f8946c-75d9-4e18-a4fd-fd1e71d5e1d5',
  TOPICS: '8417cb6b-8c41-4009-a34b-b0c8d405fcfc',
  AVAILABILITY: '24b0ffec-16ca-4b1e-a32d-799b3116471b',
  PRIOR_SPEAKING: 'ee23d7b7-a530-4131-97ec-b8d673dbc018',
  SOCIAL: '35daa6a0-e7f1-4a37-8630-6a30055f29cd',
  MESSAGE: 'f9731211-fe7e-4d0f-b0d0-8247b3356534',
  LANG: '4013d204-8dc1-4a30-bcf4-203d83fc9075',
  PAGE_PATH: '999103f8-7c2a-4415-8def-a88e7bc0c1d8',
} as const;

export const SPONSORS_Q = {
  NAME: 'f37a45b6-42ad-46cc-8313-21a2ec142337',
  EMAIL: '9bac36ba-9afa-4868-8d7d-da169e07866a',
  COMPANY: 'b3e273d4-673b-4f7f-b9f5-16e2647a1bb7',
  ROLE: '0f8a699b-3608-4e8a-9f46-6ec9a7f92e9e',
  TIER: '4e139d6e-fe72-4605-ba36-ec3326081c6a',
  CONTRIBUTION: '12fcac44-e2f5-418f-a01e-3240d164aef3',
  MESSAGE: 'f83c6987-c8e8-4aeb-99ab-086af6bbe8ee',
  LANG: 'a29c7d5b-182c-4bd6-b3c3-0e7636696a7d',
  PAGE_PATH: 'b136044c-6b2d-439d-8356-7e3986d50921',
} as const;

export const CALENDAR_Q = {
  NAME: '5e9799d0-39fc-490b-b952-32066b3b2215',
  EMAIL: '4c2686d6-7542-41f0-b26b-ddb61c254d7d',
  COMMUNITY: 'd67baf75-2779-4b71-9b36-7cc6ab781f48',
  CALENDAR_ID: 'fec89090-847f-4156-9e2f-215240324f4a',
  CALENDAR_URL: 'ecf115f9-824e-49b7-bc65-ef077a8331ed',
  WEBSITE: 'c1a76a11-f31e-4d8a-a843-6a003d2e4327',
  DESCRIPTION: 'e81995da-70ee-467d-8711-b07fd9eccc9e',
  LANG: '54f81c6f-b19e-46d6-b870-40846f951e79',
  PAGE_PATH: '20a4f02b-9117-4e16-a270-4ff9ef463a50',
} as const;

export const CONDUCT_Q = {
  INCIDENT: '949bae46-fc1b-43ab-b447-7c394310ee0e',
  WHEN: '2d7cca49-4f98-42ad-8848-cf8d44796e30',
  PEOPLE: 'f6593bd2-49ab-4beb-870b-f17429040924',
  ANONYMOUS: '8f2c430e-db32-4555-aabe-cdf6f5e291b9',
  REPORTER_NAME: '479c1448-dd1c-45ff-a621-bfc844f44675',
  REPORTER_EMAIL: '440b5adb-a759-4a0d-a65a-9f8c9900c754',
  FOLLOWUP: '258c35b8-daed-466b-941b-bf718f41b832',
  LANG: '154e1e16-507d-410f-b225-d21e467a1373',
  PAGE_PATH: '2d4b21f2-f8ce-4149-a6be-87b5ebe7feab',
} as const;

// ────────────────────────────────────────────────────────────────────────────
// Page path normalization
// ────────────────────────────────────────────────────────────────────────────

const PAGE_PATH_MAX_LEN = 200;

export function normalizePagePath(input: unknown): string {
  if (typeof input !== 'string') return '/';
  const trimmed = input.trim();
  if (!trimmed || trimmed.length > PAGE_PATH_MAX_LEN) return '/';
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

// ────────────────────────────────────────────────────────────────────────────
// Slugify (kept for tests / cross-org docs; PTT MC POSTs use labels)
// ────────────────────────────────────────────────────────────────────────────

export function slugify(label: string): string {
  const lower = label.normalize('NFKC').toLowerCase();
  const stripped = lower.replace(/[^\p{L}\p{N}\s_-]/gu, '');
  const collapsed = stripped.replace(/[-\s]+/g, '-');
  return collapsed.replace(/^[-_]+|[-_]+$/g, '');
}

// ────────────────────────────────────────────────────────────────────────────
// Choice lookups — aliases → canonical DailyBot value (label for this org)
// ────────────────────────────────────────────────────────────────────────────

interface ChoiceGroup {
  readonly aliases: readonly string[];
}

function normalizeLabel(label: string): string {
  return label
    .normalize('NFKC')
    .replace(/[–—―]/g, '-')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Build alias → canonical DailyBot value map.
 * First alias is the GET `choices[].value` / label for this org.
 */
function buildChoiceLookup(
  groups: readonly ChoiceGroup[]
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const group of groups) {
    const canonical = group.aliases[0];
    for (const alias of group.aliases) {
      out[normalizeLabel(alias)] = canonical;
    }
  }
  return out;
}

export function lookupChoice(
  label: string | undefined,
  lookup: Record<string, string>
): string | undefined | null {
  if (!label) return undefined;
  const value = lookup[normalizeLabel(label)];
  return value ?? null;
}

/** Map site `lang` (`es`/`en`) and labels to DailyBot Language choices. */
export const LANG_VALUES = buildChoiceLookup([
  { aliases: ['Spanish', 'es', 'español', 'espanol'] },
  { aliases: ['English', 'en', 'inglés', 'ingles'] },
]);

export const CONTACT_TOPIC_VALUES = buildChoiceLookup([
  { aliases: ['General', 'general'] },
  { aliases: ['Collaboration', 'collaboration'] },
  {
    aliases: [
      'The Library of Tomorrow',
      'the-library-of-tomorrow',
      'library-of-tomorrow',
      'la biblioteca del mañana',
      'la biblioteca del manana',
    ],
  },
  { aliases: ['Press', 'press', 'media'] },
  { aliases: ['Other', 'other'] },
]);

export const CFS_FORMAT_VALUES = buildChoiceLookup([
  { aliases: ['Regular', 'regular'] },
  { aliases: ['Lightning', 'lightning'] },
  { aliases: ['Panel', 'panel'] },
  { aliases: ['Workshop', 'workshop'] },
]);

export const EXPERIENCE_LEVEL_VALUES = buildChoiceLookup([
  { aliases: ['Beginner', 'beginner', 'principiante'] },
  { aliases: ['Intermediate', 'intermediate', 'intermedio'] },
  { aliases: ['Advanced', 'advanced', 'avanzado'] },
]);

export const SPONSOR_TIER_VALUES = buildChoiceLookup([
  { aliases: ['Diamond', 'diamond'] },
  { aliases: ['Gold', 'gold'] },
  { aliases: ['Silver', 'silver'] },
  { aliases: ['Bronze', 'bronze'] },
  { aliases: ['Community', 'community'] },
  { aliases: ['Unsure', 'unsure'] },
]);

export const CONTRIBUTION_TYPE_VALUES = buildChoiceLookup([
  { aliases: ['Cash', 'cash'] },
  { aliases: ['In-kind', 'in-kind', 'inkind', 'en especie'] },
  { aliases: ['Both', 'both'] },
  { aliases: ['Unsure', 'unsure'] },
]);

/**
 * Boolean Dailybot questions require JSON `true` / `false` (not "Yes"/"No").
 * Verified against PTT CFS + CoC forms (2026-08 audit).
 */
export function booleanToDailyBot(
  value: boolean | string | undefined
): boolean {
  if (typeof value === 'boolean') return value;
  const n = normalizeLabel(String(value ?? ''));
  if (['yes', 'true', '1', 'si', 'sí'].includes(n)) return true;
  if (['no', 'false', '0'].includes(n)) return false;
  return false;
}

// ────────────────────────────────────────────────────────────────────────────
// Fetch wrapper
// ────────────────────────────────────────────────────────────────────────────

export type DailyBotSubmissionError =
  | 'AUTH'
  | 'INVALID_CHOICE'
  | 'MISSING_REQUIRED'
  | 'UNREACHABLE'
  | 'UNKNOWN';

export type DailyBotSubmissionResult =
  | { ok: true; uuid: string }
  | {
      ok: false;
      error: DailyBotSubmissionError;
      status: number;
      detail?: string;
    };

export interface DailyBotEnv {
  DAILYBOT_API_KEY?: string;
}

const BASE_URL = 'https://api.dailybot.com/v1/forms/';

/**
 * POST a form response to DailyBot. Never logs `apiKey`.
 * Always submits with `automation: true`.
 */
export async function submitFormResponse(
  formUuid: string,
  content: Record<string, unknown>,
  env: DailyBotEnv
): Promise<DailyBotSubmissionResult> {
  const apiKey = env.DAILYBOT_API_KEY;
  if (!apiKey) {
    return { ok: false, error: 'AUTH', status: 503, detail: 'missing_api_key' };
  }

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${formUuid}/responses/`, {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, automation: true }),
    });
  } catch (err) {
    console.error('[dailybot] network error', err);
    return { ok: false, error: 'UNREACHABLE', status: 502 };
  }

  if (response.status === 201) {
    const data = (await response.json().catch(() => ({}))) as { uuid?: string };
    if (!data.uuid) {
      return {
        ok: false,
        error: 'UNKNOWN',
        status: 502,
        detail: 'missing_uuid_in_response',
      };
    }
    return { ok: true, uuid: data.uuid };
  }

  if (response.status === 401 || response.status === 403) {
    return { ok: false, error: 'AUTH', status: 502 };
  }

  const rawBody = await response.text().catch(() => '');
  const detail = classifyDailyBotError(rawBody);

  if (detail === 'INVALID_CHOICE' || detail === 'MISSING_REQUIRED') {
    return { ok: false, error: detail, status: 400 };
  }

  // Do not log response bodies — Dailybot may echo submitted content (incl. CoC).
  console.error('[dailybot] unexpected error', response.status, detail);
  return { ok: false, error: 'UNKNOWN', status: 502 };
}

function classifyDailyBotError(
  rawBody: string
): DailyBotSubmissionError | null {
  if (!rawBody) return null;
  try {
    const parsed = JSON.parse(rawBody) as unknown;
    if (Array.isArray(parsed) && parsed.includes('response is not valid')) {
      return 'INVALID_CHOICE';
    }
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      (parsed as { code?: string }).code === 'all_responses_are_required'
    ) {
      return 'MISSING_REQUIRED';
    }
  } catch {
    // Non-JSON error body
  }
  return null;
}
