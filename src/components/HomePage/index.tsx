import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Heading from '@theme/Heading';
import { motion } from 'framer-motion';
import CodeBlock from '@theme/CodeBlock';
import useInView from '@site/src/hooks/useInView';
import useCountUp from '@site/src/hooks/useCountUp';
import CatbeeIcon from '@site/src/components/Icon';
import styles from './index.module.scss';

export function AnimatedStat({
  end,
  suffix = '',
  label
}: Readonly<{ end: number; suffix?: string; label: string }>): ReactNode {
  const [ref, isInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const count = useCountUp({ end, duration: 2000, shouldStart: isInView });

  const displayValue = suffix === '%' ? Math.round(count) : count >= 7 ? '7+' : Math.round(count);

  return (
    <div className={styles.statItem} ref={ref}>
      <div className={styles.statNumber}>
        {displayValue}
        {suffix}
      </div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

export default function HomePage(): ReactNode {
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
              <AnimatedStat end={7} label='Packages' />
              <AnimatedStat end={100} suffix='%' label='Type Safe' />
              <AnimatedStat end={0} label='Dependencies' />
            </div>
            <div className={styles.catbeeHomeButtons}>
              <Link id='explore-docs' className={clsx('button button--lg', styles.catbeeHomePrimaryButton)} to='/docs/'>
                <CatbeeIcon name='library_books' className={styles.buttonIcon} />
                <span>Explore Documentation</span>
              </Link>
              <Link className={clsx('button button--lg', styles.catbeeHomeSecondaryButton)} to='/docs/@ng-catbee/'>
                <CatbeeIcon name='devicon-angular-plain' className={styles.buttonIcon} />
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
                  {/* <CatbeeIcon name='close' className={styles.windowDot} />
                  <CatbeeIcon name='remove' className={styles.windowDot} />
                  <CatbeeIcon name='open_in_full' className={styles.windowDot} /> */}
                  <span className={styles.windowDot} />
                  <span className={styles.windowDot} />
                  <span className={styles.windowDot} />
                </div>
                <div className={styles.catbeeDemoCodeWindowTitle}>catbee.ts</div>
              </div>
              <div className={styles.catbeeDemoCodeWindowContent}>
                <CodeBlock className='catbeeHomeCodeContainer' language='typescript'>
                  {`import { ServerConfigBuilder, ExpressServer } from '@catbee/utils';

const config = new ServerConfigBuilder()
  .withPort(3000)
  .withCors({ origin: '*' })
  .enableRateLimit({ max: 50, windowMs: 60000 })
  .enableRequestLogging({ ignorePaths: ['/healthz', '/metrics'] })
  .withHealthCheck({ path: '/health', detailed: true })
  .enableOpenApi('./openapi.yaml', { mountPath: '/docs' })
  .withGlobalHeaders({ 'X-Powered-By': 'Catbee' })
  .withGlobalPrefix('/api')
  .withRequestId({ headerName: 'X-Request-Id', exposeHeader: true })
  .enableResponseTime({ addHeader: true, logOnComplete: true })
  .build();

const server = new ExpressServer(config);

server.registerHealthCheck('database', async () => await checkDatabaseConnection());
server.useMiddleware(loggingMiddleware, errorMiddleware);

await server.start();
server.enableGracefulShutdown();
`}
                </CodeBlock>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
