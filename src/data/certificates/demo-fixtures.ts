import { getAllCertificateFixtures } from '@/lib/certificates/registry';

/**
 * Demo-only certificate fixtures — derived from validated registry.json.
 * Names are fictional; no real emails or attendee PII.
 */
export const DEMO_CERTIFICATE_FIXTURES = getAllCertificateFixtures();
