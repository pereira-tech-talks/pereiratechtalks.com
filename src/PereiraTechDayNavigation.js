import { getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Inicio',
      href: '/pereiratechday',
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
         
          },
        {
            imgHref : '~/assets/images/logos/logo-Joint-alta.png',
            imgAlt: 'joint-developer-logo',
         
          },
        {
            imgHref : '~/assets/images/logos/per-tech-talks-dark.svg',
            imgAlt: 'python-pereira-logo',
         
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
