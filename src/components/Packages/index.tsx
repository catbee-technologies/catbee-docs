import clsx from 'clsx';
import Heading from '@theme/Heading';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import styles from './index.module.scss';
import { packages } from '@site/src/package.config';

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
    icon: 'material-icons:cookie',
    link: '/docs/@ng-catbee/cookie/intro/',
    tags: ['Angular', 'SSR', 'Auth'],
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)'
  },
  '@ng-catbee/indexed-db': {
    description:
      'Reactive IndexedDB wrapper with RxJS observables. Perfect for offline-first applications and large datasets.',
    icon: 'material-icons:storage',
    link: '/docs/@ng-catbee/indexed-db/intro/',
    tags: ['Angular', 'Database', 'Offline'],
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
  },
  '@ng-catbee/jwt': {
    description: 'Decode and validate JWT tokens with ease. Built-in security checks and expiration handling.',
    icon: 'material-icons:verified_user',
    link: '/docs/@ng-catbee/jwt/intro/',
    tags: ['Angular', 'Security', 'Auth'],
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #059669)'
  },
  '@ng-catbee/loader': {
    description:
      'Professional loading indicators with 50+ animations. Blur backgrounds, customizable overlays, and more.',
    icon: 'material-icons:hourglass_empty',
    link: '/docs/@ng-catbee/loader/intro/',
    tags: ['Angular', 'UI', 'UX'],
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899, #db2777)'
  },
  '@ng-catbee/monaco-editor': {
    description: 'Seamless Monaco Editor integration for Angular. Build powerful code editors and IDEs in minutes.',
    icon: 'material-icons:code',
    link: '/docs/@ng-catbee/monaco-editor/intro/',
    tags: ['Angular', 'Editor', 'IDE'],
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)'
  },
  '@ng-catbee/storage': {
    description:
      'Reactive Web Storage API with RxJS and signals. Type-safe localStorage and sessionStorage operations.',
    icon: 'material-icons:save',
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

function PackageCard({ pkg, idx }: { pkg: (typeof packagesArr)[0]; idx: number }) {
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(50);
    mouseY.set(50);
  };

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
      <motion.a
        href={pkg.link}
        className={styles.packageCard}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={
          {
            '--package-color': pkg.color,
            '--package-gradient': pkg.gradient,
            '--mouse-x': useTransform(mouseX, v => `${v}%`),
            '--mouse-y': useTransform(mouseY, v => `${v}%`)
          } as React.CSSProperties
        }
      >
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
            <span className='material-icons'>arrow_forward</span>
          </div>
        </div>
      </motion.a>
    </motion.div>
  );
}

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
            <PackageCard key={idx} pkg={pkg} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
