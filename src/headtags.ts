import { HtmlTagObject } from '@docusaurus/types';

const title = 'Catbee';
const desc = 'Production-grade utility ecosystem for Angular and TypeScript applications. 25+ specialized utilities, complete SSR support, minimal dependencies.';
const url = 'https://catbee.in';
const faviconPath = 'media/favicon';

const headTags: HtmlTagObject[] = [
  /* Primary Meta Tags */
  { tagName: 'meta', attributes: { name: 'description', content: desc } },
  { tagName: 'meta', attributes: { name: 'keywords', content: 'catbee, utils, angular, node.js, typescript, javascript, utilities, library, npm, express, modular, tree-shakable, production-ready' } },

  /* Open Graph / Facebook */
  { tagName: 'meta', attributes: { property: 'og:type', content: 'website' } },
  { tagName: 'meta', attributes: { property: 'og:url', content: url } },
  { tagName: 'meta', attributes: { property: 'og:title', content: title } },
  { tagName: 'meta', attributes: { property: 'og:description', content: desc } },
  { tagName: 'meta', attributes: { property: 'og:image', content: `${url}/${faviconPath}/favicon-512x512.png` } },
  { tagName: 'meta', attributes: { property: 'og:image:width', content: '512' } },
  { tagName: 'meta', attributes: { property: 'og:image:height', content: '512' } },

  /* Twitter Cards */
  { tagName: 'meta', attributes: { name: 'twitter:card', content: 'summary_large_image' } },
  { tagName: 'meta', attributes: { name: 'twitter:title', content: title } },
  { tagName: 'meta', attributes: { name: 'twitter:description', content: desc } },
  { tagName: 'meta', attributes: { name: 'twitter:image', content: `${url}/${faviconPath}/favicon-512x512.png` } },

  /* Canonical Link */
  { tagName: 'link', attributes: { rel: 'canonical', href: url } },

  /* Favicons */
  { tagName: 'link', attributes: { rel: 'icon', type: 'image/png', sizes: '16x16', href: `/${faviconPath}/favicon-16x16.png` } },
  { tagName: 'link', attributes: { rel: 'icon', type: 'image/png', sizes: '32x32', href: `/${faviconPath}/favicon-32x32.png` } },
  { tagName: 'link', attributes: { rel: 'icon', type: 'image/png', sizes: '48x48', href: `/${faviconPath}/favicon-48x48.png` } },
  { tagName: 'link', attributes: { rel: 'icon', href: `/${faviconPath}/favicon.ico` } },
  { tagName: 'link', attributes: { rel: 'apple-touch-icon', sizes: '180x180', href: `/${faviconPath}/apple-touch-icon.png` } },

  /* PWA */
  { tagName: 'link', attributes: { rel: 'manifest', href: '/site.webmanifest' } },

  /* Theme */
  { tagName: 'meta', attributes: { name: 'theme-color', content: '#000000' } },
  { tagName: 'meta', attributes: { name: 'application-name', content: title } },
  { tagName: 'meta', attributes: { name: 'apple-mobile-web-app-title', content: title } },

  /* Verification Tags */
  { tagName: 'meta', attributes: { name: 'algolia-site-verification', content: 'C6E636047538A2FF' } },

  /* Preconnects & Preloads */
  { tagName: 'link', attributes: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
  { tagName: 'link', attributes: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' } },
  { tagName: 'link', attributes: { rel: 'preconnect', href: 'https://cdn.jsdelivr.net' } },
  { tagName: 'link', attributes: { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Kaushan+Script&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Material+Icons&display=swap' } },
  { tagName: 'link', attributes: { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css' } },

  /* Structured Data */
  {
    tagName: 'script',
    attributes: { type: 'application/ld+json' },
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareSourceCode',
      name: title,
      description: desc,
      url,
      codeRepository: 'https://github.com/catbee-technologies',
      license: `${url}/license`,
      programmingLanguage: 'TypeScript',
      author: { '@type': 'Organization', name: 'Catbee Technologies' }
    })
  }
];

export default headTags;
