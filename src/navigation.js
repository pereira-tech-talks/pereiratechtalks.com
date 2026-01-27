import { getAsset, getBlogPermalink, getPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Inicio',
      href: '/',
    },
    {
      text: 'Comunidad',
      links: [
        {
          text: 'Quiénes somos',
          href: '/about',
        },
        {
          text: 'Contribución',
          href: '/contributing',
        },
      ],
    },
    {
      text: 'Meetups',
      href: '/meetups',
    },
    {
      text: 'Blog',
      href: getBlogPermalink(),
    },
    {
      text: 'Contacto',
      links: [
        {
          text: 'WhatsApp',
          href: 'https://chat.whatsapp.com/EzYAadvUWyVBHt3m1FU77U',
        },
        {
          text: 'YouTube',
          href: 'https://www.youtube.com/@pereiratechtalks',
          target: '_blank',
        },
        {
          text: 'Instagram',
          href: 'https://www.instagram.com/pertechtalks/',
          target: '_blank',
        },
        {
          text: 'X (Twitter)',
          href: 'https://x.com/PerTechTalks',
          target: '_blank',
        },
      ],
    },
  ],
  actions: [{ text: 'PEREIRA TECH DAY', href: '/pereira-tech-day' }],
};

export const eventsHeaderData = {
  links: [
    {
      text: 'Meetups',
      href: '/meetups',
    },
    {
      text: 'Lightning Talks',
      href: '/pereira-tech-day/lightning-talks',
    },
  ],
};

export const footerData = {
  socialLinks: [
    {
      ariaLabel: 'WhatsApp',
      icon: 'tabler:brand-whatsapp',
      href: 'https://chat.whatsapp.com/EzYAadvUWyVBHt3m1FU77U',
      target: '_blank',
    },
    {
      ariaLabel: 'X',
      icon: 'tabler:brand-x',
      href: 'https://x.com/PerTechTalks',
      target: '_blank',
    },
    {
      ariaLabel: 'Instagram',
      icon: 'tabler:brand-instagram',
      href: 'https://www.instagram.com/pertechtalks/',
      target: '_blank',
    },
    {
      ariaLabel: 'Youtube',
      icon: 'tabler:brand-youtube',
      href: 'https://www.youtube.com/@pereiratechtalks',
      target: '_blank',
    },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    {
      ariaLabel: 'Github',
      icon: 'tabler:brand-github',
      href: 'https://github.com/pereira-tech-talks/',
      target: '_blank',
    },
  ],
  footNote: `
    Based on <a href="https://github.com/onwidget/astrowind" target="_blank" rel="noopener noreferrer"><b>AstroWind</b></a> · Powered by <a href="https://pages.github.com/" target="_blank" rel="noopener noreferrer"><b>GitHub</b></a> · Made with ♥️  by <a href="https://github.com/orgs/pereira-tech-talks/people" target="_blank" rel="noopener noreferrer"><b>Pereira Tech Talks</b></a> Team · All rights reserved.
  `,
  links: [
    {
      title: 'Comunidad',
      links: [
        { text: 'JointDev', href: 'https://jointdevweb.firebaseapp.com/' },
        { text: 'PereiraJS', href: 'https://pereira.js.org/' },
        { text: 'Python Pereira', href: 'https://pypereira.co' },
        {
          text: 'Manizales Tech Talks',
          href: 'https://www.meetup.com/es/manizalestechtalks/',
        },
        {
          text: 'Quindio Tech',
          href: 'https://www.meetup.com/es-ES/quindio-tech/',
        },
      ],
    },
    {
      title: 'Apoya',
      links: [
        {
          text: 'ASE UTP',
          href: 'https://egresados.utp.edu.co/',
        },
        { text: 'DailyBot', href: 'https://www.dailybot.com/' },
        { text: 'Social&Co', href: 'https://socialco.com.co/' },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Código de Conducta', href: getPermalink('/codigo-conducta') },
  ],
};
