import type { APIRoute } from 'astro';
import { SITE_URL } from '@/lib/constances';

import { serializeGenericToMarkdown } from '@/lib/markdown-for-agents';

export const GET: APIRoute = () => {
  const markdown = serializeGenericToMarkdown({
    title: 'Convocatoria de ponentes — Pereira Tech Talks',
    description:
      'Propón tu charla para un próximo meetup de Pereira Tech Talks, una edición de Pereira Tech Day o una cohorte de la Speaker School. Las charlas pueden ser en español, inglés o mezcla.',
    lang: 'es',
    canonical: `${SITE_URL}/call-for-speakers`,
    sections: [
      {
        heading: 'Qué buscamos',
        lines: [
          '- Charlas técnicas y prácticas, ancladas en experiencia real',
          '- Arquitectura, oficio del software, IA/agentes, devops, mobile, plataformas web, seguridad, ciclo de vida del software',
          '- Programas de comunidad: La Biblioteca del Mañana, cohortes de Speaker School, sesiones del AI Channel',
          '- Ponentes primerizos bienvenidos: damos mentoría a través del programa Speaker School',
        ],
      },
      {
        heading: 'Formatos',
        lines: [
          '- Lightning talk (5–10 min)',
          '- Charla estándar (20–30 min)',
          '- Workshop o sesión hands-on (60–120 min)',
          '- Panel (varios ponentes, 45–60 min)',
        ],
      },
      {
        heading: 'Cómo aplicar',
        lines: [
          `- Envía tu propuesta en la Convocatoria de ponentes: ${SITE_URL}/call-for-speakers/`,
          '- O escribe a pereiratechtalks@gmail.com con asunto "Convocatoria de ponentes"',
          '- Incluye: título propuesto, abstract (150–300 palabras), bio, idioma, formato deseado',
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
