import { Navbar } from '@docusaurus/theme-common';
import { packages } from './package.config';
import { DeepPartial } from './types';

const navbar: DeepPartial<Navbar> = {
  title: 'Catbee',
  logo: {
    alt: 'Catbee Logo',
    src: '/media/favicon/apple-touch-icon.png'
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
        ...packages
          .filter(pkg => pkg.startsWith('@catbee'))
          .map(pkg => ({
            label: pkg,
            to: `/docs/${pkg}/intro/`
          })),
        {
          type: 'html',
          value: '<hr style="margin: 0.3rem 0;">'
        },
        ...packages
          .filter(pkg => pkg.startsWith('@ng-catbee'))
          .map(pkg => ({
            label: pkg,
            to: `/docs/${pkg}/intro/`
          }))
      ]
    },
    {
      type: 'dropdown',
      label: 'Tools',
      position: 'left',
      className: 'navbar-tools-dropdown',
      items: [
        { href: 'https://ide.catbee.in', label: 'JS/TS Online Compiler' },
        { href: 'https://diff.catbee.in', label: 'Diff Checker' }
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
