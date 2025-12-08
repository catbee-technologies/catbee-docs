import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import { motion } from 'framer-motion';
import styles from './index.module.scss';
import { packages } from '@site/src/package.config';

export default function GetStarted() {
  return (
    <section id='catbeeGetStartedSection' className={styles.catbeeGetStartedSection}>
      <div className='container'>
        <motion.div
          className={styles.getStartedContent}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Heading as='h2' className={styles.getStartedTitle}>
            Get Started
          </Heading>
          <p className={styles.getStartedDescription}>Install any package and start using it in your project.</p>
          <div className={styles.getStartedButtons}>
            <Link className={clsx('button button--lg', styles.getStartedPrimaryButton)} to='/docs/'>
              Get Started Now
            </Link>
            <Link
              className={clsx('button button--lg', styles.getStartedSecondaryButton)}
              to='https://github.com/catbee-technologies'
              target='_blank'
            >
              View on GitHub
            </Link>
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
