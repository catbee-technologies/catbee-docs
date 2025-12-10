import clsx from 'clsx';
import Heading from '@theme/Heading';
import { motion } from 'framer-motion';
import styles from './index.module.scss';
import { packages } from '@site/src/package.config';
import PackageManagerTabs from './PackageManagerTabs';
import RippleButton from './RippleButton';

export default function GetStarted() {
  return (
    <section id='catbeeGetStartedSection' className={styles.catbeeGetStartedSection}>
      <div className='container'>
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
            <RippleButton href='/docs/' variant='primary'>
              <span className={clsx('material-icons', styles.buttonIcon)}>library_books</span>
              <span>Explore Documentation</span>
            </RippleButton>
            <RippleButton href='https://github.com/catbee-technologies' target='_blank' variant='secondary'>
              <span className={clsx('devicon-github-original', styles.buttonIcon)}></span>
              <span>View on GitHub</span>
            </RippleButton>
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
      </div>
    </section>
  );
}
