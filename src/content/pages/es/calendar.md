---
title: Calendario comunitario
description: Calendario compartido de la comunidad tech de Pereira — meetups de Pereira Tech Talks y eventos de comunidades aliadas en Risaralda.
lastUpdated: 2026-08-07
---

## Hub de calendario comunitario

La página `/calendar` agrega feeds **públicos de Google Calendar** de Pereira Tech Talks y comunidades tech aliadas de Pereira. Es una página estática en Cloudflare Pages — sin claves de API, solo IDs de calendario públicos configurados en `src/content/communityCalendars/`.

### Funciones

- **Vistas de mes y agenda** mediante embed de Google Calendar
- **Filtros por comunidad** para mostrar u ocultar calendarios individuales
- **Enlaces ICS** de suscripción por comunidad activa
- **RSVP en Luma** para eventos principales de Pereira Tech Talks (`https://luma.com/pertechtalks`)
- **Formulario de propuesta** en la misma página (`#calendar-intake`) para que organizaciones aliadas envíen un ID público de Google Calendar

### Rutas

- Español (principal): [/calendar](/calendar)
- Inglés: [/en/calendar](/en/calendar)

### Configuración

Cada calendario comunitario es un archivo YAML en `src/content/communityCalendars/` con:

- `name` / `description` (bilingüe `en` + `es`)
- `googleCalendarId` (ID público para embed)
- `color` (hex, usado en leyenda y embed)
- `website`, `lumaUrl` (opcionales, solo `https://`)
- `active`, `order`, `primary`

Las entradas inactivas aparecen en “Más comunidades muy pronto” hasta que las organizaciones compartan un ID público verificado.
