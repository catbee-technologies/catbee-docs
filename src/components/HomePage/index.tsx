import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Heading from '@theme/Heading';
import { motion } from 'framer-motion';
import CodeBlock from '@theme/CodeBlock';
import styles from './index.module.scss';

export default function HomePage() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.catbeeHomeBanner)}>
      <div id='homeContainer' className='container'>
        <div className={styles.catbeeHomeBannerContent}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Heading as='h1' className={styles.catbeeTitle}>
              {siteConfig.title}
            </Heading>
            <p className={styles.catbeeTagLine}>{siteConfig.tagline}</p>
            <p className={clsx(styles.catbeeDescription)} style={{ paddingLeft: 0 }}>
              A <strong>production-grade</strong> utility ecosystem for <strong>Angular</strong> and{' '}
              <strong>TypeScript</strong> applications. Battle-tested in enterprise environments, offering 25+
              specialized utilities, complete SSR support, and zero dependencies. Every module is tree-shakable, fully
              typed, and optimized for minimal bundle impact.
            </p>
            <div className={styles.catbeeStats}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>7+</div>
                <div className={styles.statLabel}>Packages</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>100%</div>
                <div className={styles.statLabel}>Type Safe</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>0</div>
                <div className={styles.statLabel}>Dependencies</div>
              </div>
            </div>
            <div className={styles.catbeeHomeButtons}>
              <Link id='explore-docs' className={clsx('button button--lg', styles.catbeeHomePrimaryButton)} to='/docs/'>
                <span className={clsx('material-icons', styles.buttonIcon)}>library_books</span>
                <span>Explore Documentation</span>
              </Link>
              <Link className={clsx('button button--lg', styles.catbeeHomeSecondaryButton)} to='/docs/@ng-catbee/'>
                <i className={clsx('devicon-angular-plain', styles.buttonIcon)}></i>
                <span>Angular Packages</span>
              </Link>
            </div>
          </motion.div>
          <motion.div
            className={styles.catbeeDemoCode}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className={styles.catbeeDemoCodeWindow}>
              <div className={styles.catbeeDemoCodeWindowHeader}>
                <div className={styles.catbeeDemoCodeWindowDots}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className={styles.catbeeDemoCodeWindowTitle}>catbee.ts</div>
              </div>
              <div className={styles.catbeeDemoCodeWindowContent}>
                <CodeBlock className='catbeeHomeCodeContainer' language='typescript'>
                  {`// Example usage of Catbee packages
import { ExpressServer, ServerConfigBuilder } from '@catbee/utils';
const config = new ServerConfigBuilder()
  .withGlobalPrefix('/api/v1')
  .withPort(3000)
  .build();
const server = new ExpressServer(config);
server.start();

// Example usage of ng-catbee/cookie
import { Component, inject } from '@angular/core';
import { CatbeeCookieService } from '@ng-catbee/cookie';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private readonly cookie = inject(CatbeeCookieService);

  setSessionCookie() {
    this.cookie.set('session_id', 'abc123', {
      path: '/',
      secure: true,
      sameSite: 'Lax'
    });
  }
}`}
                </CodeBlock>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
