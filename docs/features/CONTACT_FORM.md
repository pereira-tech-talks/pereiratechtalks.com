# Contact & community intake (v3)

> **Canonical guide:** [FORMS.md](./FORMS.md) — Dailybot Forms architecture,
> `_form` discriminator, UUIDs, env vars, CoC privacy, and local testing.

`POST /api/contact` (`functions/api/contact.ts`) is the shared edge endpoint for
all community intakes. **Dailybot is the system of record.** Optional Resend
auto-ack may run after a successful Dailybot response.

| Surface | Route | `_form` |
|---------|-------|---------|
| General contact | `/contact` | `contact` |
| Call for Speakers | `/call-for-speakers` | `cfs` |
| Speaker School | `/verticals/speaker-school` | `speaker-school` |
| Sponsor us | `/sponsor-us` | `sponsor` |
| Community calendar | `/calendar#calendar-intake` | `calendar` |
| Code of Conduct | `/conduct#conduct-report-form` | `conduct` |

Contact topics (UI): `general` · `collaboration` · `the-library-of-tomorrow` ·
`press` · `other`. CFS / sponsorship / conduct use dedicated pages.

All intakes POST JSON to `CONTACT_FORM.apiEndpoint` (default `/api/contact`).
There is **no** Google Forms fallback.

### Client modules

- Validators: `src/lib/contact-form.ts`
- Focus helper: `src/lib/form-ui.ts`
- UI: `ContactForm.svelte`, `SpeakersApplicationForm.svelte`,
  `SponsorInquiryForm.svelte`, `SpeakerSchoolForm.svelte`,
  `CalendarIntakeForm.svelte`, `ConductReportForm.svelte`
- Tests: `tests/unit/lib/contact-form.test.ts`,
  `tests/unit/functions/contact-dailybot.test.ts`
