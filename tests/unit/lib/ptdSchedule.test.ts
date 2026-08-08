import type { CollectionEntry } from 'astro:content';
import { describe, expect, it } from 'vitest';
import {
  buildScheduleView,
  countPendingSessions,
  formatSlotTime,
  getScheduleSpeakerSlugs,
  getScheduleTypeLabel,
  getSlotDurationMinutes,
  isSessionSlot,
  type PtdScheduleSlot,
  toSpeakerView,
} from '@/lib/ptdSchedule';

const mockSpeaker = (
  id: string,
  overrides: Partial<CollectionEntry<'speakers'>['data']> = {}
): CollectionEntry<'speakers'> =>
  ({
    id,
    collection: 'speakers',
    data: {
      name: 'Debbie Arredondo',
      role: { en: 'Entrepreneur', es: 'Emprendedor' },
      bio: { en: 'Electrical engineer.', es: 'Ingeniero eléctrico.' },
      photo: {
        src: '/images/speakers/debbie-arredondo.webp',
        alt: { en: 'Portrait', es: 'Retrato' },
      },
      social: { linkedin: 'https://linkedin.com/in/debbiearredondo/' },
      talks: [],
      languages: ['es'],
      ...overrides,
    },
  }) as unknown as CollectionEntry<'speakers'>;

const slot = (overrides: Partial<PtdScheduleSlot> = {}): PtdScheduleSlot =>
  ({
    time: '08:30',
    endTime: '09:10',
    type: 'talk',
    ...overrides,
  }) as PtdScheduleSlot;

const buildOptions = {
  lang: 'es' as const,
  urlPrefix: '',
  speakers: [mockSpeaker('debbie-arredondo')],
  pendingNameTemplate: 'Ponente {n}',
  pendingTitleLabel: 'Pronto',
};

describe('formatSlotTime', () => {
  it('renders 24h values as localized 12h labels', () => {
    expect(formatSlotTime('08:30', 'es')).toBe('8:30 a.m.');
    expect(formatSlotTime('08:30', 'en')).toBe('8:30 AM');
    expect(formatSlotTime('13:35', 'es')).toBe('1:35 p.m.');
    expect(formatSlotTime('13:35', 'en')).toBe('1:35 PM');
  });

  it('maps midnight and noon to 12', () => {
    expect(formatSlotTime('00:15', 'en')).toBe('12:15 AM');
    expect(formatSlotTime('12:00', 'en')).toBe('12:00 PM');
  });

  it('passes through values that are not HH:mm', () => {
    expect(formatSlotTime('9:15 AM', 'es')).toBe('9:15 AM');
    expect(formatSlotTime('99:99', 'es')).toBe('99:99');
  });
});

describe('getSlotDurationMinutes', () => {
  it('returns the gap in minutes', () => {
    expect(getSlotDurationMinutes('08:30', '09:10')).toBe(40);
    expect(getSlotDurationMinutes('12:55', '13:00')).toBe(5);
  });

  it('returns null for missing, unparsable, or non-positive ranges', () => {
    expect(getSlotDurationMinutes('08:30')).toBeNull();
    expect(getSlotDurationMinutes('08:30', 'noon')).toBeNull();
    expect(getSlotDurationMinutes('09:10', '08:30')).toBeNull();
  });
});

describe('isSessionSlot / getScheduleTypeLabel', () => {
  it('treats talks, keynotes, and panels as sessions', () => {
    expect(isSessionSlot('talk')).toBe(true);
    expect(isSessionSlot('keynote')).toBe(true);
    expect(isSessionSlot('panel')).toBe(true);
  });

  it('treats logistics slots as non-sessions', () => {
    for (const type of [
      'break',
      'sponsor-break',
      'registration',
      'staff',
      'closing',
    ] as const) {
      expect(isSessionSlot(type)).toBe(false);
    }
  });

  it('localizes type labels', () => {
    expect(getScheduleTypeLabel('sponsor-break', 'es')).toBe('Sponsor break');
    expect(getScheduleTypeLabel('break', 'es')).toBe('Descanso');
    expect(getScheduleTypeLabel('break', 'en')).toBe('Break');
  });
});

describe('toSpeakerView', () => {
  it('flattens a speaker entry into a serializable payload', () => {
    const view = toSpeakerView(mockSpeaker('debbie-arredondo'), 'es', '/en');
    expect(view.name).toBe('Debbie Arredondo');
    expect(view.role).toBe('Emprendedor');
    expect(view.profileHref).toBe('/en/speakers/debbie-arredondo/');
    expect(view.social).toEqual([
      {
        key: 'linkedin',
        href: 'https://linkedin.com/in/debbiearredondo/',
        label: 'Debbie Arredondo — linkedin',
      },
    ]);
  });

  it('falls back to a generated alt when the photo has none', () => {
    const view = toSpeakerView(
      mockSpeaker('x', { photo: { src: '/x.webp' } }),
      'es',
      ''
    );
    expect(view.photoAlt).toBe('Portrait of Debbie Arredondo');
  });
});

describe('buildScheduleView', () => {
  it('resolves a revealed speaker and keeps the authored talk title', () => {
    const [view] = buildScheduleView(
      [
        slot({
          speaker: 'debbie-arredondo',
          title: { en: 'Complex projects', es: 'Proyectos complejos' },
          description: { en: 'Abstract', es: 'Resumen' },
        }),
      ],
      buildOptions
    );

    expect(view.session).toBe(true);
    expect(view.pending).toBe(false);
    expect(view.title).toBe('Proyectos complejos');
    expect(view.description).toBe('Resumen');
    expect(view.speaker?.name).toBe('Debbie Arredondo');
    expect(view.timeLabel).toBe('8:30 a.m.');
    expect(view.endTimeLabel).toBe('9:10 a.m.');
    expect(view.durationLabel).toBe('40 min');
  });

  it('numbers pending sessions chronologically, skipping logistics rows', () => {
    const views = buildScheduleView(
      [
        slot({ time: '07:30', endTime: '08:00', type: 'registration' }),
        slot({ time: '08:30' }),
        slot({ time: '09:15', speaker: 'debbie-arredondo', title: 'Charla' }),
        slot({ time: '10:00' }),
        slot({ time: '10:50', type: 'break' }),
        slot({ time: '11:25' }),
      ],
      buildOptions
    );

    expect(views.map((v) => v.title)).toEqual([
      '',
      'Ponente 1',
      'Charla',
      'Ponente 3',
      '',
      'Ponente 4',
    ]);
    expect(views.filter((v) => v.pending)).toHaveLength(3);
  });

  it('marks a slot pending when its speaker slug cannot be resolved', () => {
    const [view] = buildScheduleView(
      [slot({ speaker: 'ghost-speaker' })],
      buildOptions
    );
    expect(view.speaker).toBeNull();
    expect(view.pending).toBe(true);
    expect(view.title).toBe('Ponente 1');
  });

  it('falls back to the speaker name when a revealed talk has no title', () => {
    const [view] = buildScheduleView(
      [slot({ speaker: 'debbie-arredondo' })],
      buildOptions
    );
    expect(view.title).toBe('Debbie Arredondo');
  });

  it('emits stable unique keys for slots sharing a start time', () => {
    const views = buildScheduleView([slot(), slot()], buildOptions);
    expect(new Set(views.map((v) => v.key)).size).toBe(2);
  });
});

describe('getScheduleSpeakerSlugs / countPendingSessions', () => {
  const schedule = [
    slot({ type: 'registration' }),
    slot({ speaker: 'debbie-arredondo' }),
    slot({ speaker: 'debbie-arredondo' }),
    slot(),
    slot(),
  ];

  it('de-duplicates referenced speaker slugs', () => {
    expect(getScheduleSpeakerSlugs(schedule)).toEqual(['debbie-arredondo']);
  });

  it('counts sessions still waiting for a reveal', () => {
    expect(countPendingSessions(schedule)).toBe(2);
  });
});
