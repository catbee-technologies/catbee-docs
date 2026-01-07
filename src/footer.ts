import { MultiColumnFooter } from '@docusaurus/theme-common';
import { DeepPartial } from './types';
import { packages } from './package.config';

const footer: DeepPartial<MultiColumnFooter> = {
  links: [
    {
      title: 'Documentation',
      className: 'footer-title-docs',
      items: [
        {
          label: 'Getting Started',
          to: '/docs/'
        },
        {
          label: '@catbee Packages',
          to: '/docs/@catbee/'
        },
        {
          label: '@ng-catbee Packages',
          to: '/docs/@ng-catbee/'
        },
        {
          label: 'License',
          to: '/license'
        }
      ]
    },
    {
      title: 'Packages',
      className: 'footer-title-packages',
      items: packages.map(pkg => ({
        label: pkg,
        to: `/docs/${pkg}/intro`
      }))
    },
    {
      title: 'Community',
      className: 'footer-title-community',
      items: [
        {
          label: 'GitHub Organization',
          href: 'https://github.com/catbee-technologies'
        },
        {
          label: 'Catbee Utils',
          href: 'https://github.com/catbee-technologies/catbee-utils'
        },
        {
          label: 'Ng Catbee',
          href: 'https://github.com/catbee-technologies/ng-catbee'
        },
        {
          label: 'Report Issues (@catbee/utils)',
          href: 'https://github.com/catbee-technologies/catbee-utils/issues'
        },
        {
          label: 'Report Issues (@ng-catbee)',
          href: 'https://github.com/catbee-technologies/ng-catbee/issues'
        },
        {
          label: 'Contribute to Documentation',
          href: 'https://github.com/catbee-technologies/catbee-docs/blob/main/CONTRIBUTING.md'
        },
        {
          label: 'Contribute (@catbee/utils)',
          href: 'https://github.com/catbee-technologies/catbee-utils/blob/main/CONTRIBUTING.md'
        },
        {
          label: 'Contribute (@ng-catbee)',
          href: 'https://github.com/catbee-technologies/ng-catbee/blob/main/CONTRIBUTING.md'
        }
      ]
    },
    {
      title: 'Resources',
      className: 'footer-title-resources',
      items: [
        {
          label: 'NPM Registry (@catbee)',
          href: 'https://www.npmjs.com/org/catbee'
        },
        {
          label: 'NPM Registry (@ng-catbee)',
          href: 'https://www.npmjs.com/org/ng-catbee'
        },
        {
          label: 'Angular Docs',
          href: 'https://angular.dev/'
        },
        {
          label: 'Node.js Docs',
          href: 'https://nodejs.org/docs'
        },
        {
          label: 'Express Docs',
          href: 'https://expressjs.com'
        },
        {
          label: 'TypeScript Docs',
          href: 'https://www.typescriptlang.org/docs'
        },
        {
          label: 'RxJS Docs',
          href: 'https://rxjs.dev/guide/overview'
        }
      ]
    }
  ],
  copyright: `
        <div>
          <div>
            <div>
              Copyright © ${new Date().getFullYear()} <strong>Catbee Technologies</strong>. All rights reserved.
            </div>
          </div>
          <div style="margin-top: 1rem; font-size: 0.85rem; opacity: 0.8;">
            Built with ♡ for the developer community. Open source and free to use under MIT License.
          </div>
        </div>
      `
};

export default footer;
