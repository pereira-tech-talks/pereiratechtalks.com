import { getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Inicio',
      href: '/pereira-tech-day',
    },
    {
      text: 'Comunidad',
      href: '/',
    }
  ],
};

export const footerData = {
    extraLogos : [
        {
            imgHref : '~/assets/images/logos/per-tech-talks-dark.svg',
            imgAlt: 'pereira-tech-talks-logo',
            imgWidth : 200
         
          },
        {
            imgHref : '~/assets/images/logos/logo-Joint-alta.png',
            imgAlt: 'joint-developer-logo',
            imgWidth : 100
         
          },
        {
            imgHref : '~/assets/images/logos/logo-python-pereira.svg',
            imgAlt: 'python-pereira-logo',
            imgWidth : 100
         
          },
    ],
  socialLinks: [
    {
      ariaLabel: 'WhatsApp',
      icon: 'tabler:brand-whatsapp',
      href: 'https://chat.whatsapp.com/EzYAadvUWyVBHt3m1FU77U',
      target: '_blank',
    },
    { ariaLabel: 'Telegram', icon: 'tabler:brand-telegram', href: 'https://t.me/PerTechTalks', target: '_blank' },
    { ariaLabel: 'X', icon: 'tabler:brand-x', href: 'https://x.com/PerTechTalks', target: '_blank' },
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
  ]
};
