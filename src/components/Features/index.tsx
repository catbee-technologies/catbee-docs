import type { ReactNode } from 'react';
import Heading from '@theme/Heading';
import MouseTrackingWrapper from '@site/src/components/MouseTrackingWrapper';
import CatbeeIcon from '@site/src/components/Icon';
import styles from './index.module.scss';
import CatbeeSection from '../Section';

type FeatureItem = {
  title: ReactNode;
  icon: string;
  description: ReactNode;
};

const CircleIcon = () => (
  <>
    <CatbeeIcon name='check_circle' style={{ fontSize: '0.9rem' }} />{' '}
  </>
);

const FeatureList: FeatureItem[] = [
  {
    title: 'Modular & Tree-Shakable',
    icon: 'account_tree',
    description: (
      <>
        <strong>Import only what you need.</strong> Every utility is independently importable with full tree-shaking
        support. Dead code elimination keeps your production bundles lean—often under 2KB per utility.
        <div className={styles.featureHighlight}>
          <span className={styles.badge}>
            <CircleIcon />
            Zero Bloat
          </span>
          <span className={styles.badge}>
            <CircleIcon />
            Optimal Bundles
          </span>
        </div>
      </>
    )
  },
  {
    title: 'Production-Ready',
    icon: 'factory',
    description: (
      <>
        <strong>Battle-tested in enterprise environments.</strong> Comprehensive error handling, detailed logging, SSR
        compatibility, and security utilities. Trusted by production applications serving millions of users.
        <div className={styles.featureHighlight}>
          <span className={styles.badge}>
            <CircleIcon />
            SSR Support
          </span>
          <span className={styles.badge}>
            <CircleIcon />
            Error Handling
          </span>
        </div>
      </>
    )
  },
  {
    title: 'TypeScript First',
    icon: 'devicon-typescript-plain',
    description: (
      <>
        <strong>100% type-safe with strict mode enabled.</strong> Rich type definitions, intelligent autocomplete, and
        compile-time error detection. Catch bugs before runtime with full IntelliSense support.
        <div className={styles.featureHighlight}>
          <span className={styles.badge}>
            <CircleIcon />
            Strict Mode
          </span>
          <span className={styles.badge}>
            <CircleIcon />
            IntelliSense
          </span>
        </div>
      </>
    )
  },
  {
    title: 'Zero Dependencies',
    icon: 'cloud_off',
    description:
      'No bloat, no conflicts. Pure TypeScript implementations that keep your bundle lean and build times fast.'
  },
  {
    title: 'Performance First',
    icon: 'flash_on',
    description: 'Optimized algorithms, lazy loading, and tree-shaking support. Every byte counts in production.'
  },
  {
    title: 'Fully Documented',
    icon: 'library_books',
    description: 'Extensive API documentation, real-world examples, and migration guides. Get productive in minutes.'
  }
];

function Feature({ title, icon, description }: Readonly<FeatureItem>): ReactNode {
  return (
    <MouseTrackingWrapper
      className={styles.featureCard}
      initialX={50}
      initialY={50}
      resetOnLeave={true}
      motionProps={{
        initial: { opacity: 0, y: 50 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-50px' },
        transition: { duration: 0.6, ease: [0.175, 0.885, 0.32, 1.275] }
      }}
    >
      <div className={styles.featureIconWrapper}>
        <CatbeeIcon name={icon} className={styles.featureIcon} />
      </div>
      <div className={styles.featureContent}>
        <Heading as='h3' className={styles.featureTitle}>
          {title}
        </Heading>
        <div className={styles.featureDescription}>{description}</div>
      </div>
    </MouseTrackingWrapper>
  );
}

export default function Features(): ReactNode {
  return (
    <CatbeeSection
      id='catbeeFeatures'
      title='Why Choose Catbee?'
      description='Purpose-built for modern TypeScript and Angular applications. Zero compromises on quality, performance, or developer experience.'
      icon='workspace_premium'
      className={styles.catbeeFeatures}
    >
      <div className={styles.featuresRow}>
        {FeatureList.map((props, idx) => (
          <Feature key={idx} {...props} />
        ))}
      </div>
    </CatbeeSection>
  );
}
