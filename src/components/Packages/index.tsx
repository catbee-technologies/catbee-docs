import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import { motion } from 'framer-motion';
import styles from './index.module.scss';
import { packages } from '@site/src/package.config';

const packageMetadata: Record<
  string,
  {
    description: string;
    icon: string;
    link: string;
    tags: string[];
  }
> = {
  '@catbee/utils': {
    description:
      '25+ production-ready utilities for arrays, dates, objects, strings, and more. Zero dependencies, fully typed.',
    icon: 'devicon-typescript-plain',
    link: '/docs/@catbee/utils/intro/',
    tags: ['Node.js', 'TypeScript', 'Tree-shakable']
  },
  '@ng-catbee/cookie': {
    description:
      'Type-safe cookie management with SSR support. Handle authentication, preferences, and session data effortlessly.',
    icon: 'material-icons:cookie',
    link: '/docs/@ng-catbee/cookie/intro/',
    tags: ['Angular', 'SSR', 'Auth']
  },
  '@ng-catbee/indexed-db': {
    description:
      'Reactive IndexedDB wrapper with RxJS observables. Perfect for offline-first applications and large datasets.',
    icon: 'material-icons:storage',
    link: '/docs/@ng-catbee/indexed-db/intro/',
    tags: ['Angular', 'Database', 'Offline']
  },
  '@ng-catbee/jwt': {
    description: 'Decode and validate JWT tokens with ease. Built-in security checks and expiration handling.',
    icon: 'material-icons:verified_user',
    link: '/docs/@ng-catbee/jwt/intro/',
    tags: ['Angular', 'Security', 'Auth']
  },
  '@ng-catbee/loader': {
    description:
      'Professional loading indicators with 50+ animations. Blur backgrounds, customizable overlays, and more.',
    icon: 'material-icons:hourglass_empty',
    link: '/docs/@ng-catbee/loader/intro/',
    tags: ['Angular', 'UI', 'UX']
  },
  '@ng-catbee/monaco-editor': {
    description: 'Seamless Monaco Editor integration for Angular. Build powerful code editors and IDEs in minutes.',
    icon: 'material-icons:code',
    link: '/docs/@ng-catbee/monaco-editor/intro/',
    tags: ['Angular', 'Editor', 'IDE']
  },
  '@ng-catbee/storage': {
    description:
      'Reactive Web Storage API with RxJS and signals. Type-safe localStorage and sessionStorage operations.',
    icon: 'material-icons:save',
    link: '/docs/@ng-catbee/storage/intro/',
    tags: ['Angular', 'Storage', 'Reactive']
  }
};

const packagesArr = packages
  .filter(pkgName => pkgName in packageMetadata)
  .map(pkgName => ({
    title: pkgName,
    ...packageMetadata[pkgName]
  }));

export default function Packages() {
  return (
    <section id='catbeePackagesSection' className={styles.catbeePackagesSection}>
      <div className='container'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Heading as='h2' className={styles.sectionTitle}>
            <span className={clsx('material-icons', styles.titleIcon)}>widgets</span>
            Explore Our Packages
          </Heading>
          <p className={styles.sectionSubtitle}>
            Specialized tools for every part of your application. Click any package to dive into the documentation.
          </p>
        </motion.div>

        <div className={styles.packagesGrid}>
          {packagesArr.map((pkg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
            >
              <Link to={pkg.link} className={styles.packageCard}>
                <div className={styles.packageHeader}>
                  <div className={styles.packageIconWrapper}>
                    {pkg.icon.startsWith('material-icons:') ? (
                      <span className={clsx('material-icons', styles.packageIcon)}>
                        {pkg.icon.replace('material-icons:', '')}
                      </span>
                    ) : (
                      <i className={clsx(pkg.icon, styles.packageIcon)}></i>
                    )}
                  </div>
                  <div className={styles.packageBadge}>
                    <span className='material-icons'>open_in_new</span>
                  </div>
                </div>

                <Heading as='h3' className={styles.packageTitle}>
                  {pkg.title}
                </Heading>
                <p className={styles.packageDescription}>{pkg.description}</p>

                <div className={styles.packageFooter}>
                  <div className={styles.packageTags}>
                    {pkg.tags.map((tag, i) => (
                      <span key={i} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className={styles.packageArrow}>
                    <span className='material-icons'>arrow_forward</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
