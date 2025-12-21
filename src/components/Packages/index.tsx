import type { ReactNode } from 'react';
import Heading from '@theme/Heading';
import { motion } from 'framer-motion';
import { packages } from '@site/src/package.config';
import Link from '@docusaurus/Link';
import MouseTrackingWrapper from '@site/src/components/MouseTrackingWrapper';
import CatbeeIcon from '@site/src/components/Icon';
import styles from './index.module.scss';
import CatbeeSection from '../Section';

const packageMetadata: Record<
  string,
  {
    description: string;
    icon: string;
    link: string;
    tags: string[];
    color: string;
    gradient: string;
  }
> = {
  '@catbee/utils': {
    description:
      '25+ production-ready utilities for arrays, dates, objects, strings, and more. Zero dependencies, fully typed.',
    icon: 'devicon-typescript-plain',
    link: '/docs/@catbee/utils/intro/',
    tags: ['Node.js', 'TypeScript', 'Tree-shakable'],
    color: '#3178c6',
    gradient: 'linear-gradient(135deg, #3178c6, #235a97)'
  },
  '@ng-catbee/cookie': {
    description:
      'Type-safe cookie management with SSR support. Handle authentication, preferences, and session data effortlessly.',
    icon: 'cookie',
    link: '/docs/@ng-catbee/cookie/intro/',
    tags: ['Angular', 'SSR', 'Auth'],
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)'
  },
  '@ng-catbee/indexed-db': {
    description:
      'Reactive IndexedDB wrapper with RxJS observables. Perfect for offline-first applications and large datasets.',
    icon: 'storage',
    link: '/docs/@ng-catbee/indexed-db/intro/',
    tags: ['Angular', 'Database', 'Offline'],
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
  },
  '@ng-catbee/jwt': {
    description: 'Decode and validate JWT tokens with ease. Built-in security checks and expiration handling.',
    icon: 'verified_user',
    link: '/docs/@ng-catbee/jwt/intro/',
    tags: ['Angular', 'Security', 'Auth'],
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #059669)'
  },
  '@ng-catbee/loader': {
    description:
      'Professional loading indicators with 50+ animations. Blur backgrounds, customizable overlays, and more.',
    icon: 'hourglass_empty',
    link: '/docs/@ng-catbee/loader/intro/',
    tags: ['Angular', 'UI', 'UX'],
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899, #db2777)'
  },
  '@ng-catbee/monaco-editor': {
    description: 'Seamless Monaco Editor integration for Angular. Build powerful code editors and IDEs in minutes.',
    icon: 'code',
    link: '/docs/@ng-catbee/monaco-editor/intro/',
    tags: ['Angular', 'Editor', 'IDE'],
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)'
  },
  '@ng-catbee/storage': {
    description:
      'Reactive Web Storage API with RxJS and signals. Type-safe localStorage and sessionStorage operations.',
    icon: 'save',
    link: '/docs/@ng-catbee/storage/intro/',
    tags: ['Angular', 'Storage', 'Reactive'],
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)'
  }
};

const packagesArr = packages
  .filter(pkgName => pkgName in packageMetadata)
  .map(pkgName => ({
    title: pkgName,
    ...packageMetadata[pkgName]
  }));

function PackageCard({ pkg, idx }: Readonly<{ pkg: (typeof packagesArr)[0]; idx: number }>): ReactNode {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay: idx * 0.1,
        ease: [0.175, 0.885, 0.32, 1.275]
      }}
    >
      <Link href={pkg.link} style={{ textDecoration: 'none', color: 'inherit' }}>
        <MouseTrackingWrapper
          initialX={50}
          initialY={50}
          resetOnLeave={true}
          className={styles.packageCard}
          style={
            {
              '--package-color': pkg.color,
              '--package-gradient': pkg.gradient
            } as React.CSSProperties
          }
        >
          <div className={styles.packageHeader}>
            <div className={styles.packageIconWrapper}>
              <CatbeeIcon name={pkg.icon} className={styles.packageIcon} />
            </div>
            <div className={styles.packageBadge}>
              <CatbeeIcon name='open_in_new' />
            </div>
          </div>

          <Heading as='h3' className={styles.packageTitle}>
            {pkg.title}
          </Heading>
          <p className={styles.packageDescription}>{pkg.description}</p>

          <div className={styles.packageFooter}>
            <div className={styles.packageTags}>
              {pkg.tags.map((tag, tagIdx) => (
                <span key={tagIdx} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </MouseTrackingWrapper>
      </Link>
    </motion.div>
  );
}

export default function Packages() {
  return (
    <CatbeeSection
      id='catbeePackagesSection'
      title='Explore Our Packages'
      description='Specialized tools for every part of your application. Click any package to dive into the documentation.'
      icon='widgets'
      className={styles.catbeePackagesSection}
    >
      <div className={styles.packagesGrid}>
        {packagesArr.map((pkg, idx) => (
          <PackageCard key={idx} pkg={pkg} idx={idx} />
        ))}
      </div>
    </CatbeeSection>
  );
}
