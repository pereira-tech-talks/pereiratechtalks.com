import type { CertificateFixture } from '@/lib/certificates/types';

/**
 * Demo-only certificate fixtures for Pereira Tech Day 2026.
 * Names are fictional; no real emails or attendee PII.
 * Production issuance will replace this via CSV/signed registry.
 */
export const DEMO_CERTIFICATE_FIXTURES: CertificateFixture[] = [
  {
    id: 'ptd26_demo_a7k3m9qx',
    eventYear: 2026,
    eventSlug: 'pereira-tech-day',
    subjectName: 'Alex Rivera Demo',
    role: 'attendee',
    issuedAt: '2026-08-25T15:00:00.000Z',
    status: 'valid',
    eventName: {
      en: 'Pereira Tech Day 2026',
      es: 'Pereira Tech Day 2026',
    },
    eventDate: '2026-08-22',
    location: {
      en: 'Universidad Tecnológica de Pereira, Pereira, Colombia',
      es: 'Universidad Tecnológica de Pereira, Pereira, Colombia',
    },
    issuerName: {
      en: 'Pereira Tech Talks',
      es: 'Pereira Tech Talks',
    },
  },
  {
    id: 'ptd26_demo_b2n8w4pz',
    eventYear: 2026,
    eventSlug: 'pereira-tech-day',
    subjectName: 'Sam Ortega Demo',
    role: 'speaker',
    issuedAt: '2026-08-25T15:05:00.000Z',
    status: 'valid',
    eventName: {
      en: 'Pereira Tech Day 2026',
      es: 'Pereira Tech Day 2026',
    },
    eventDate: '2026-08-22',
    location: {
      en: 'Universidad Tecnológica de Pereira, Pereira, Colombia',
      es: 'Universidad Tecnológica de Pereira, Pereira, Colombia',
    },
    issuerName: {
      en: 'Pereira Tech Talks',
      es: 'Pereira Tech Talks',
    },
  },
  {
    id: 'ptd26_demo_c5r1v6jy',
    eventYear: 2026,
    eventSlug: 'pereira-tech-day',
    subjectName: 'Jordan Méndez Demo',
    role: 'volunteer',
    issuedAt: '2026-08-25T15:10:00.000Z',
    status: 'valid',
    eventName: {
      en: 'Pereira Tech Day 2026',
      es: 'Pereira Tech Day 2026',
    },
    eventDate: '2026-08-22',
    location: {
      en: 'Universidad Tecnológica de Pereira, Pereira, Colombia',
      es: 'Universidad Tecnológica de Pereira, Pereira, Colombia',
    },
    issuerName: {
      en: 'Pereira Tech Talks',
      es: 'Pereira Tech Talks',
    },
  },
  {
    id: 'ptd26_demo_revoked01',
    eventYear: 2026,
    eventSlug: 'pereira-tech-day',
    subjectName: 'Casey Demo Revoked',
    role: 'attendee',
    issuedAt: '2026-08-25T15:15:00.000Z',
    status: 'revoked',
    eventName: {
      en: 'Pereira Tech Day 2026',
      es: 'Pereira Tech Day 2026',
    },
    eventDate: '2026-08-22',
    location: {
      en: 'Universidad Tecnológica de Pereira, Pereira, Colombia',
      es: 'Universidad Tecnológica de Pereira, Pereira, Colombia',
    },
    issuerName: {
      en: 'Pereira Tech Talks',
      es: 'Pereira Tech Talks',
    },
  },
];
