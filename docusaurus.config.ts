// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)
import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import headTags from './src/headtags';
import navbar from './src/navbar';
import footer from './src/footer';

const config: Config = {
  title: 'Catbee',
  tagline: 'Production-Grade Utilities for Angular & TypeScript',
  favicon: '/media/favicon/favicon.ico',
  future: { v4: true },
  url: 'https://catbee.in',
  baseUrl: '/',
  headTags,
  organizationName: 'catbee-technologies',
  projectName: '@catbee/utils',
  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn'
    }
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en']
  },
  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/docs',
          sidebarPath: './sidebars.ts',
          showLastUpdateTime: true,
          breadcrumbs: true,
          showLastUpdateAuthor: true,
          editUrl: 'https://github.com/catbee-technologies/catbee-docs/tree/main/'
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true
          },
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn'
        },
        theme: {
          customCss: ['./src/css/styles.scss']
        }
      } satisfies Preset.Options
    ]
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true
    },
    // announcementBar: {
    //   id: 'new-release-monaco-editor-v21',
    //   content: `🚀 Monaco Editor v21 is now available on <a href="https://www.npmjs.com/package/@ng-catbee/monaco-editor">npm</a>!`,
    //   backgroundColor: 'var(--catbee-primary-color)',
    //   textColor: '#ffffff',
    //   isCloseable: true
    // },
    navbar,
    footer,
    algolia: {
      appId: 'SULA4ODR5K',
      apiKey: 'c1ca6b1bdecb0c04ec41317e3e0983dc',
      indexName: 'catbee_docs'
      // askAi: 'iUNsiSy95pWK'
    },
    prism: {
      theme: prismThemes.vsLight,
      darkTheme: prismThemes.oneDark
    }
  } satisfies Preset.ThemeConfig,
  plugins: ['@docusaurus/plugin-client-redirects', 'docusaurus-plugin-sass']
};

export default config;
