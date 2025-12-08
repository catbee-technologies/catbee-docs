import { HtmlTagObject } from '@docusaurus/types';

const headTags: HtmlTagObject[] = [
  {
    tagName: 'meta',
    attributes: {
      name: 'description',
      content:
        'Catbee - Production-grade utility ecosystem for Angular and TypeScript applications. 25+ specialized utilities, complete SSR support, zero dependencies.'
    }
  },
  {
    tagName: 'meta',
    attributes: {
      name: 'keywords',
      content:
        'catbee, utils, angular, node.js, typescript, javascript, utilities, library, npm, express, modular, tree-shakable, production-ready'
    }
  },
  {
    tagName: 'meta',
    attributes: {
      property: 'og:title',
      content: 'Catbee - Production-Grade Utilities for Angular & TypeScript'
    }
  },
  {
    tagName: 'meta',
    attributes: {
      property: 'og:description',
      content:
        'Battle-tested utility ecosystem with 25+ specialized modules, complete SSR support, and zero dependencies.'
    }
  },
  {
    tagName: 'meta',
    attributes: {
      property: 'og:type',
      content: 'website'
    }
  },
  {
    tagName: 'meta',
    attributes: {
      property: 'og:url',
      content: 'https://catbee.in'
    }
  },
  {
    tagName: 'meta',
    attributes: {
      property: 'og:image',
      content: 'https://catbee.in/favicon/android-chrome-512x512.png'
    }
  },
  {
    tagName: 'meta',
    attributes: {
      name: 'twitter:card',
      content: 'summary_large_image'
    }
  },
  {
    tagName: 'meta',
    attributes: {
      name: 'twitter:title',
      content: 'Reusable utility modules for Angular, Node.js and TypeScript, designed for performance and simplicity.'
    }
  },
  {
    tagName: 'meta',
    attributes: {
      name: 'twitter:description',
      content: 'Reusable utility modules for Node.js and TypeScript, designed for performance and simplicity.'
    }
  },
  {
    tagName: 'meta',
    attributes: {
      name: 'twitter:image',
      content: 'https://catbee.in/favicon/android-chrome-512x512.png'
    }
  },
  {
    tagName: 'meta',
    attributes: {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1'
    }
  },
  {
    tagName: 'link',
    attributes: {
      rel: 'icon',
      href: '/favicon/favicon.ico'
    }
  },
  {
    tagName: 'link',
    attributes: {
      rel: 'canonical',
      href: 'https://catbee.in'
    }
  },
  {
    tagName: 'meta',
    attributes: {
      name: 'theme-color',
      content: '#000'
    }
  },
  {
    tagName: 'link',
    attributes: {
      rel: 'manifest',
      href: '/site.webmanifest'
    }
  },
  {
    tagName: 'link',
    attributes: {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/favicon/apple-touch-icon.png'
    }
  },
  {
    tagName: 'meta',
    attributes: {
      name: 'robots',
      content: 'index, follow'
    }
  },
  {
    tagName: 'meta',
    attributes: {
      name: 'algolia-site-verification',
      content: 'C6E636047538A2FF'
    }
  },
  {
    tagName: 'script',
    attributes: {
      type: 'application/ld+json'
    },
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareSourceCode',
      name: 'Catbee',
      description:
        'Production-grade utility ecosystem for Angular and TypeScript applications with 25+ specialized modules, complete SSR support, and zero dependencies.',
      url: 'https://catbee.in',
      codeRepository: 'https://github.com/catbee-technologies',
      license: 'https://catbee.in/license',
      programmingLanguage: 'TypeScript',
      author: {
        '@type': 'Organization',
        name: 'Catbee Technologies'
      }
    })
  }
];

export default headTags;
