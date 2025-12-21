import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { packages } from '@site/src/package.config';
import Button from '@site/src/components/Button';
import PackageManagerTabs from '@site/src/components/PackageManagerTabs';
import CatbeeSection from '@site/src/components/Section';
import Heading from '@theme/Heading';
import styles from './index.module.scss';

export default function GetStarted(): ReactNode {
  return (
    <CatbeeSection id='catbeeGetStartedSection' className={styles.catbeeGetStartedSection}>
      <motion.div
        className={styles.getStartedContent}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.175, 0.885, 0.32, 1] }}
      >
        <Heading as='h2' className={styles.getStartedTitle}>
          Get Started in Seconds
        </Heading>
        <p className={styles.getStartedDescription}>
          Choose your package manager and start building amazing applications with Catbee.
        </p>

        <PackageManagerTabs packageName='@catbee/utils' />

        <div className={styles.getStartedButtons}>
          <Button
            href='/docs/'
            variant='primary'
            icon='library_books'
            iconClassName={styles.buttonIcon}
            iconPosition='left'
          >
            <span>Explore Documentation</span>
          </Button>
          <Button
            href='https://github.com/catbee-technologies'
            target='_blank'
            variant='secondary'
            icon='devicon-github-original'
            iconClassName={styles.buttonIcon}
            iconPosition='left'
          >
            <span>View on GitHub</span>
          </Button>
        </div>

        <div className={styles.getStartedCodeSnippet}>
          <div className={styles.marqueeGroup}>
            {packages.map((pkg, idx) => (
              <span key={`pkg-1-${idx}`}>{pkg}</span>
            ))}
          </div>
          <div className={styles.marqueeGroup} aria-hidden='true'>
            {packages.map((pkg, idx) => (
              <span key={`pkg-2-${idx}`}>{pkg}</span>
            ))}
          </div>
        </div>
      </motion.div>
    </CatbeeSection>
  );
}
