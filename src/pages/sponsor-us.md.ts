import type { APIRoute } from 'astro';

import { serializeGenericToMarkdown } from '@/lib/markdown-for-agents';

const SITE_URL = 'https://pereiratechtalks.org';

export const GET: APIRoute = () => {
  const markdown = serializeGenericToMarkdown({
    title: 'Patrocínanos — Pereira Tech Talks',
    description:
      'Conecta tu marca con la comunidad técnica más activa del Eje Cafetero. Desde 2014 hemos llevado a cabo más de 90 meetups y 7 ediciones de Pereira Tech Day.',
    lang: 'es',
    canonical: `${SITE_URL}/sponsor-us`,
    sections: [
      {
        heading: 'Por qué patrocinar',
        lines: [
          'Patrocinar a Pereira Tech Talks no es publicidad: es construir comunidad.',
          'Cada aporte se traduce en venues accesibles, comida para asistentes, becas para Speaker School, transporte para ponentes invitados y eventos abiertos a toda la región.',
        ],
      },
      {
        heading: 'Alcance estimado',
        lines: [
          '- 90+ meetups desde 2014',
          '- 200+ charlas dictadas',
          '- 6.500+ asistencias acumuladas',
          '- 12 años activos',
        ],
      },
      {
        heading: 'Niveles de patrocinio',
        lines: [
          '- **Diamante** — Aliado estratégico anual. Co-branding en PTD y meetups del año, spot de keynote, menciones mensuales, acceso al hiring pool, logo en banner principal.',
          '- **Oro** — Aliado anual. Logo en el programa de PTD, una charla técnica patrocinada al año, menciones en 6+ meetups, acceso al hiring pool.',
          '- **Plata** — Patrocinador puntual. Logo en el evento patrocinado, menciones pre y post, stand opcional.',
          '- **Comunidad** — Aporte no monetario (venues, comida, transporte, becas). Logo en el evento apoyado y reconocimiento en la página de patrocinadores.',
        ],
      },
      {
        heading: 'Cómo iniciar la conversación',
        lines: [
          `- Formulario: ${SITE_URL}/contact/?topic=collaboration`,
          '- Correo: hello@pereiratechtalks.org',
          '- Cuéntanos qué te interesa apoyar (un meetup, un programa, Pereira Tech Day, becas) y te mandamos un sponsor deck a la medida.',
        ],
      },
    ],
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
