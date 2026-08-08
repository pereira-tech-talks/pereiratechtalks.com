import { z } from 'zod';

import {
  CERTIFICATE_ROLES,
  CERTIFICATE_STATUSES,
  type LocalizedString,
} from '@/lib/certificates/types';

const localizedStringSchema = z.object({
  en: z.string().min(1),
  es: z.string().min(1),
});

const opaqueIdSchema = z
  .string()
  .min(8)
  .max(64)
  .regex(/^[a-z0-9_]+$/i, 'Certificate id must be opaque alphanumeric');

export const certificateRegistryEventSchema = z.object({
  id: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/),
  year: z.number().int().min(2017),
  slug: z.string().min(1),
  name: localizedStringSchema,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  location: localizedStringSchema,
  issuerName: localizedStringSchema,
  transparencyLevel: z.literal('vc-level-2'),
});

export const certificateRegistryRecordSchema = z.object({
  id: opaqueIdSchema,
  eventId: z.string().min(3),
  subjectName: z.string().min(2).max(200),
  role: z.enum(CERTIFICATE_ROLES),
  issuedAt: z.iso.datetime(),
  status: z.enum(CERTIFICATE_STATUSES),
  replacedBy: opaqueIdSchema.optional(),
});

export const certificateRegistrySchema = z.object({
  version: z.literal(1),
  events: z.array(certificateRegistryEventSchema).min(1),
  certificates: z.array(certificateRegistryRecordSchema),
});

export type CertificateRegistryEvent = z.infer<
  typeof certificateRegistryEventSchema
>;
export type CertificateRegistryRecord = z.infer<
  typeof certificateRegistryRecordSchema
>;
export type CertificateRegistry = z.infer<typeof certificateRegistrySchema>;

export function parseCertificateRegistry(data: unknown): CertificateRegistry {
  return certificateRegistrySchema.parse(data);
}

export function registryRecordToFixture(
  record: CertificateRegistryRecord,
  event: CertificateRegistryEvent
): {
  id: string;
  eventYear: number;
  eventSlug: string;
  subjectName: string;
  role: CertificateRegistryRecord['role'];
  issuedAt: string;
  status: CertificateRegistryRecord['status'];
  eventName: LocalizedString;
  eventDate: string;
  location: LocalizedString;
  issuerName: LocalizedString;
} {
  return {
    id: record.id,
    eventYear: event.year,
    eventSlug: event.slug,
    subjectName: record.subjectName,
    role: record.role,
    issuedAt: record.issuedAt,
    status: record.status,
    eventName: event.name,
    eventDate: event.date,
    location: event.location,
    issuerName: event.issuerName,
  };
}
