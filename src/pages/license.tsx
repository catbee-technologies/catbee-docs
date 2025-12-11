import { useState, useEffect } from 'react';
import { type ReactNode } from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './license.module.scss';
import RawLicense from './raw-license';

export default function License(): ReactNode {
  const [showRaw, setShowRaw] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('raw') === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (showRaw) {
      url.searchParams.set('raw', 'true');
    } else {
      url.searchParams.delete('raw');
    }
    window.history.replaceState({}, '', url.toString());
    window.scrollTo(0, 0);
  }, [showRaw]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0 }
    }
  };

  return (
    <Layout title='License' description='MIT License - Catbee Technologies'>
      <div className={styles.toggleBar}>
        <motion.button
          type='button'
          className={styles.toggleButton}
          onClick={() => setShowRaw(v => !v)}
          aria-label={showRaw ? 'View Designed License' : 'View Raw License'}
          whileTap={{ scale: 0.95 }}
        >
          <span className='material-icons'>{showRaw ? 'palette' : 'code'}</span>
          <span>{showRaw ? 'View Designed License' : 'View Raw License'}</span>
        </motion.button>
      </div>
      <div className={styles.licensePage}>
        <div className='container'>
          <AnimatePresence mode='wait'>
            {showRaw ? (
              <motion.div
                key='raw'
                className={styles.licenseContent}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className={styles.rawLicenseBox}>
                  <RawLicense />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key='designed'
                className={styles.licenseContent}
                variants={containerVariants}
                initial='hidden'
                animate='visible'
                exit={{ opacity: 0, y: -20 }}
              >
                <motion.div className={styles.licenseHeader} variants={itemVariants}>
                  <Heading as='h1' className={styles.licenseTitle}>
                    MIT License
                  </Heading>
                </motion.div>

                <div className={styles.licenseBody}>
                  <motion.div className={styles.copyrightSection} variants={itemVariants}>
                    <p className={styles.copyrightText}>
                      Copyright © {new Date().getFullYear()} <strong>Catbee Technologies</strong>.{' '}
                      <Link to='https://catbee.in/license' className={styles.licenseLink}>
                        https://catbee.in/license
                      </Link>
                    </p>
                  </motion.div>

                  <motion.div className={styles.permissionsSection} variants={itemVariants}>
                    <Heading as='h2' className={styles.sectionTitle}>
                      <span className='material-icons'>check_circle</span>
                      What You Can Do
                    </Heading>
                    <div className={styles.permissionsGrid}>
                      {[
                        { icon: 'edit', title: 'Modify', desc: 'Change the code to fit your needs' },
                        { icon: 'share', title: 'Distribute', desc: 'Share copies with anyone' },
                        { icon: 'attach_money', title: 'Commercial Use', desc: 'Use in commercial projects' },
                        { icon: 'business', title: 'Private Use', desc: 'Use privately in your company' }
                      ].map((item, idx) => (
                        <motion.div
                          key={item.title}
                          className={styles.permissionCard}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 + idx * 0.1 }}
                        >
                          <span className='material-icons'>{item.icon}</span>
                          <Heading as='h3'>{item.title}</Heading>
                          <p>{item.desc}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div className={styles.licenseText} variants={itemVariants}>
                    <p>
                      Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
                      associated documentation files (the &quot;Software&quot;), to deal in the Software without
                      restriction, including without limitation the rights to use, copy, modify, merge, publish,
                      distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
                      Software is furnished to do so, subject to the following conditions:
                    </p>
                    <p>
                      The above copyright notice and this permission notice shall be included in all copies or
                      substantial portions of the Software.
                    </p>
                  </motion.div>

                  <motion.div className={styles.disclaimerSection} variants={itemVariants}>
                    <Heading as='h2' className={styles.sectionTitle}>
                      <span className='material-icons'>warning</span>
                      Disclaimer
                    </Heading>
                    <div className={styles.disclaimerBox}>
                      <p>
                        THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
                        INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE
                        AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
                        DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                        OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div className={styles.additionalInfo} variants={itemVariants}>
                    {[
                      {
                        icon: 'info',
                        title: 'Attribution',
                        desc: "While not required, we appreciate attribution in your project's documentation or credits section."
                      },
                      {
                        icon: 'support',
                        title: 'Support',
                        desc: 'Community support is available through GitHub issues and discussions.'
                      },
                      {
                        icon: 'favorite',
                        title: 'Contribute',
                        desc: 'We welcome contributions! Check out our contributing guidelines on GitHub.'
                      }
                    ].map(item => (
                      <div key={item.title} className={styles.infoCard}>
                        <span className='material-icons'>{item.icon}</span>
                        <div>
                          <Heading as='h3'>{item.title}</Heading>
                          <p>{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
