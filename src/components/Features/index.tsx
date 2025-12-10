import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import styles from './index.module.scss';

type FeatureItem = {
  title: ReactNode;
  icon: string;
  iconType: 'material' | 'devicon';
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Modular & Tree-Shakable',
    icon: 'account_tree',
    iconType: 'material',
    description: (
      <>
        <strong>Import only what you need.</strong> Every utility is independently importable with full tree-shaking
        support. Dead code elimination keeps your production bundles lean—often under 2KB per utility.
        <div className={styles.featureHighlight}>
          <span className={styles.badge}>
            <span className='material-icons' style={{ fontSize: '0.9rem', verticalAlign: 'middle' }}>
              check_circle
            </span>{' '}
            Zero Bloat
          </span>
          <span className={styles.badge}>
            <span className='material-icons' style={{ fontSize: '0.9rem', verticalAlign: 'middle' }}>
              check_circle
            </span>{' '}
            Optimal Bundles
          </span>
        </div>
      </>
    )
  },
  {
    title: 'Production-Ready',
    icon: 'factory',
    iconType: 'material',
    description: (
      <>
        <strong>Battle-tested in enterprise environments.</strong> Comprehensive error handling, detailed logging, SSR
        compatibility, and security utilities. Trusted by production applications serving millions of users.
        <div className={styles.featureHighlight}>
          <span className={styles.badge}>
            <span className='material-icons' style={{ fontSize: '0.9rem', verticalAlign: 'middle' }}>
              check_circle
            </span>{' '}
            SSR Support
          </span>
          <span className={styles.badge}>
            <span className='material-icons' style={{ fontSize: '0.9rem', verticalAlign: 'middle' }}>
              check_circle
            </span>{' '}
            Error Handling
          </span>
        </div>
      </>
    )
  },
  {
    title: 'TypeScript First',
    icon: 'devicon-typescript-plain',
    iconType: 'devicon',
    description: (
      <>
        <strong>100% type-safe with strict mode enabled.</strong> Rich type definitions, intelligent autocomplete, and
        compile-time error detection. Catch bugs before runtime with full IntelliSense support.
        <div className={styles.featureHighlight}>
          <span className={styles.badge}>
            <span className='material-icons' style={{ fontSize: '0.9rem', verticalAlign: 'middle' }}>
              check_circle
            </span>{' '}
            Strict Mode
          </span>
          <span className={styles.badge}>
            <span className='material-icons' style={{ fontSize: '0.9rem', verticalAlign: 'middle' }}>
              check_circle
            </span>{' '}
            IntelliSense
          </span>
        </div>
      </>
    )
  },
  {
    title: 'Zero Dependencies',
    icon: 'cloud_off',
    iconType: 'material',
    description:
      'No bloat, no conflicts. Pure TypeScript implementations that keep your bundle lean and build times fast.'
  },
  {
    title: 'Performance First',
    icon: 'flash_on',
    iconType: 'material',
    description: 'Optimized algorithms, lazy loading, and tree-shaking support. Every byte counts in production.'
  },
  {
    title: 'Fully Documented',
    icon: 'library_books',
    iconType: 'material',
    description: 'Extensive API documentation, real-world examples, and migration guides. Get productive in minutes.'
  }
];

function Feature({ title, icon, iconType, description }: FeatureItem) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(((e.clientX - rect.left) / rect.width) * 100);
    mouseY.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  return (
    <motion.div
      className={styles.featureCard}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.175, 0.885, 0.32, 1.275] }}
      onMouseMove={handleMouseMove}
      style={{
        // @ts-expect-error CSS variables
        '--mouse-x': useTransform(mouseX, v => `${v}%`),
        '--mouse-y': useTransform(mouseY, v => `${v}%`)
      }}
    >
      <div className={styles.featureIconWrapper}>
        {iconType === 'material' ? (
          <span className={clsx('material-icons', styles.featureIcon)}>{icon}</span>
        ) : (
          <i className={clsx(icon, styles.featureIcon)}></i>
        )}
      </div>
      <div className={styles.featureContent}>
        <Heading as='h3' className={styles.featureTitle}>
          {title}
        </Heading>
        <div className={styles.featureDescription}>{description}</div>
      </div>
    </motion.div>
  );
}

export default function Features(): ReactNode {
  return (
    <section id='catbeeFeatures' className={styles.catbeeFeatures}>
      <div className='container'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={styles.featuresHeader}
        >
          <Heading as='h2' className={styles.featuresTitle}>
            <span className={`material-icons ${styles.titleIcon}`}>workspace_premium</span>
            Why Choose Catbee?
          </Heading>
          <p className={styles.featuresSubtitle}>
            Purpose-built for modern TypeScript and Angular applications. Zero compromises on quality, performance, or
            developer experience.
          </p>
        </motion.div>

        <div className={styles.featuresRow}>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
