import type { APIRoute } from 'astro';
import { SITE_URL } from '@/lib/constances';

import { serializeGenericToMarkdown } from '@/lib/markdown-for-agents';

export const GET: APIRoute = () => {
  const markdown = serializeGenericToMarkdown({
    title: 'Prensa — Pereira Tech Talks',
    description:
      'Recursos para periodistas, podcasters y aliados de medios que cubren Pereira Tech Talks: hechos clave, descargas de marca, boilerplate y contacto directo.',
    lang: 'es',
    canonical: `${SITE_URL}/press`,
    sections: [
      {
        heading: 'Hechos clave',
        lines: [
          '- Fundación: Pereira, Risaralda, Colombia · 2014',
          '- Naturaleza: comunidad sin fines de lucro, organizada por voluntariado',
          '- Idiomas: sitio en español e inglés',
          '- Programas: Meetups mensuales · Pereira Tech Day · Speaker School · La Biblioteca del Mañana · AI Channel',
          '- Cifras: 90+ meetups · 200+ charlas · 6.500+ asistencias · 7 ediciones de Pereira Tech Day',
          '- Modelo: eventos gratuitos sostenidos por patrocinadores',
        ],
      },
      {
        heading: 'Descripción breve (boilerplate)',
        lines: [
          'Pereira Tech Talks es una comunidad de constructores, ponentes y aprendices con sede en Pereira, Risaralda, Colombia. Desde 2014 hemos organizado más de 90 meetups y siete ediciones de Pereira Tech Day, conectando el talento local con el ecosistema tech global a través de meetups mensuales, la Speaker School, La Biblioteca del Mañana y el AI Channel.',
        ],
      },
      {
        heading: 'Descargas de marca',
        lines: [
          `- [Logotipo principal (SVG)](${SITE_URL}/images/brand/pereira-tech-talks-logo.svg) — vector para fondos claros y oscuros`,
          `- [Avatar cuadrado (PNG 512×512)](${SITE_URL}/icons/icon-512x512.png) — para perfiles y portadas`,
          `- [Apple touch icon (PNG 180×180)](${SITE_URL}/icons/apple-touch-icon.png) — para integraciones móviles`,
        ],
      },
      {
        heading: 'Contacto de prensa',
        lines: [
          `- Formulario: ${SITE_URL}/contact/?topic=press`,
          '- Correo: pereiratechtalks@gmail.com',
          '- Para entrevistas, cubrimientos en sitio, fotografía o cualquier solicitud editorial.',
        ],
      },
      {
        heading: 'Páginas útiles',
        lines: [
          `- [Sobre la comunidad](${SITE_URL}/about/)`,
          `- [Programas](${SITE_URL}/verticals/)`,
          `- [Pereira Tech Day](${SITE_URL}/pereira-tech-day/)`,
          `- [Patrocinadores](${SITE_URL}/sponsors/)`,
          `- [Contribuyentes](${SITE_URL}/contributors/)`,
        ],
      },
    ],
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': 'inline',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
