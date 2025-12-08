import { Navbar } from '@docusaurus/theme-common';
import { packages } from './package.config';
import { DeepPartial } from './types';

const navbar: DeepPartial<Navbar> = {
  title: 'Catbee',
  logo: {
    alt: 'Catbee Logo',
    src: 'favicon/android-chrome-192x192.png'
  },
  items: [
    {
      type: 'docSidebar',
      sidebarId: 'docsSidebar',
      position: 'left',
      label: 'Documentation',
      className: 'navbar-docs-link'
    },
    {
      type: 'dropdown',
      label: 'Packages',
      position: 'left',
      className: 'navbar-packages-dropdown',
      items: [
        {
          label: '@catbee/utils',
          to: '/docs/@catbee/utils/intro/'
        },
        {
          type: 'html',
          value: '<hr style="margin: 0.3rem 0;">'
        },
        ...packages
          .filter(pkg => pkg !== '@catbee/utils')
          .map(pkg => ({
            label: pkg,
            to: `/docs/${pkg}/intro/`
          }))
      ]
    },
    { to: '/license/', label: 'License', position: 'left', className: 'navbar-license-link' },
    {
      type: 'search',
      position: 'right'
    },
    {
      label: 'GitHub',
      position: 'right',
      items: [
        { href: 'https://github.com/catbee-technologies/catbee-utils', label: 'Catbee Utils' },
        { href: 'https://github.com/catbee-technologies/ng-catbee', label: 'Ng Catbee' },
        { href: 'https://github.com/catbee-technologies/catbee-docs', label: 'Catbee Docs' }
      ]
    },
    {
      label: 'NPM',
      position: 'right',
      items: packages.map(pkg => ({ href: `https://www.npmjs.com/package/${pkg}`, label: pkg }))
    }
  ],
  hideOnScroll: false
};

export default navbar;
