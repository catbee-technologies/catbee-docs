import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import { motion } from 'framer-motion';
import MicrosoftButton from '@site/src/components/MicrosoftButton';
import MouseTrackingWrapper from '@site/src/components/MouseTrackingWrapper';
import styles from './catbee-container-studio.module.scss';

const mediaPath = '/media/catbee-container-studio';

const capabilities = [
  {
    number: '01',
    title: 'Containers, at a glance',
    description: 'See running state, ports, CPU, memory, and grouped workloads in one calm operational view.',
    image: `${mediaPath}/1.containers-list.png`
  },
  {
    number: '02',
    title: 'Inspect without leaving the app',
    description:
      'Read logs, environment variables, mounts, and configuration details without assembling another command.',
    image: `${mediaPath}/2.containers-logs.png`
  },
  {
    number: '03',
    title: 'A file browser for Docker',
    description:
      'Explore, edit, and manage files inside containers and volumes with the same directness as a local folder.',
    image: `${mediaPath}/5.containers-files.png`
  }
];

const gallery = [
  { label: 'Resource pulse', image: `${mediaPath}/7.containers-stats.png` },
  { label: 'Image inventory', image: `${mediaPath}/8.images-list.png` },
  { label: 'Run from an image', image: `${mediaPath}/10.images-run.png` },
  { label: 'Volume explorer', image: `${mediaPath}/12.volumes-files.png` }
];

export default function ContainerStudioPage(): ReactNode {
  return (
    <Layout
      title='CatBee Container Studio'
      description='A focused desktop control room for Docker containers, images, volumes, and files.'
    >
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroGrid} />
          <div className={clsx('container', styles.heroInner)}>
            <motion.div
              className={styles.heroCopy}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className={styles.eyebrow}>
                <span /> Desktop tooling for Docker
              </p>
              <Heading as='h1'>
                Docker,
                <br />
                <em>Clearly in view.</em>
              </Heading>
              <p className={styles.heroLead}>
                CatBee Container Studio is a focused control room for Docker. Run, inspect, monitor, and manage your
                containers, images, volumes, and files without losing your flow to the command line.
              </p>
              <div className={styles.heroActions}>
                <Link
                  className={styles.primaryButton}
                  href='https://github.com/catbee-technologies/catbee-container-studio/releases/latest'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Download the latest <span>↗</span>
                </Link>
                <MicrosoftButton />
              </div>
              <div className={styles.platforms}>
                <span>Windows</span>
                <i /> <span>macOS</span>
                <i /> <span>Linux</span>
              </div>
            </motion.div>

            <motion.div
              className={styles.heroVisual}
              initial={{ opacity: 0, x: 30, rotate: 1 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 1, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={styles.visualLabel}>
                <span className={styles.statusDot} /> Docker Engine connected
              </div>
              <MouseTrackingWrapper
                initialX={50}
                initialY={50}
                resetOnLeave={false}
                smoothing={0.2}
                className={styles.screenshotFrame}
              >
                <img
                  src={`${mediaPath}/1.containers-list.png`}
                  alt='CatBee Container Studio showing a list of running Docker containers'
                />
              </MouseTrackingWrapper>
              <div className={styles.visualNote}>Monitor and manage Docker resources from one desktop app.</div>
            </motion.div>
          </div>
        </section>

        <motion.section
          className={styles.introBand}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={clsx('container', styles.intro)}>
            <div className={styles.sectionKicker}>Manage Docker visually</div>
            <div className={styles.introHeading}>
              <Heading as='h2'>
                Manage containers,
                <br />
                <span>images, and volumes.</span>
              </Heading>
              <p>
                View container status, inspect runtime details, read logs, monitor resources, and browse files without
                switching between Docker commands and separate tools.
              </p>
            </div>
            <div className={styles.capabilityGrid}>
              {capabilities.map((capability, index) => (
                <motion.article
                  className={styles.capability}
                  key={capability.number}
                  initial={{ opacity: 0, y: 24, scale: 0.985 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className={styles.capabilityMeta}>
                    <span>{capability.number}</span>
                    <span className={styles.arrow}>↗</span>
                  </div>
                  <MouseTrackingWrapper
                    initialX={50}
                    initialY={50}
                    resetOnLeave={false}
                    smoothing={0.2}
                    className={styles.capabilityImage}
                  >
                    <img src={capability.image} alt='' loading='lazy' />
                  </MouseTrackingWrapper>
                  <Heading as='h3'>{capability.title}</Heading>
                  <p>{capability.description}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          className={styles.darkBand}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={clsx('container', styles.darkBandInner)}>
            <div className={styles.darkBandCopy}>
              <div className={styles.sectionKicker}>Docker resources in one workspace</div>
              <Heading as='h2'>
                Inspect and manage
                <br />
                <span>every resource.</span>
              </Heading>
              <p>
                Open images, volumes, container statistics, file systems, and runtime details from the same focused
                desktop interface.
              </p>
              <Link
                className={styles.outlineButton}
                href='https://github.com/catbee-technologies/catbee-container-studio'
              >
                View the source on GitHub <span>↗</span>
              </Link>
            </div>
            <div className={styles.gallery}>
              {gallery.map((item, index) => (
                <motion.figure
                  className={clsx(styles.galleryItem, index === 0 && styles.galleryFeature)}
                  key={item.label}
                  initial={{ opacity: 0, y: 20, scale: 0.985 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.65, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <MouseTrackingWrapper
                    initialX={50}
                    initialY={50}
                    resetOnLeave={false}
                    smoothing={0.2}
                    className={styles.galleryMedia}
                  >
                    <img
                      src={item.image}
                      alt={`CatBee Container Studio ${item.label.toLowerCase()} view`}
                      loading='lazy'
                    />
                  </MouseTrackingWrapper>
                  <figcaption>{item.label}</figcaption>
                </motion.figure>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          className={styles.downloadBand}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={clsx('container', styles.download)}>
            <div>
              <div className={styles.sectionKicker}>Download Container Studio</div>
              <Heading as='h2'>
                Manage Docker
                <br />
                from your desktop.
              </Heading>
            </div>
            <div className={styles.downloadAction}>
              <Link
                className={styles.primaryButton}
                href='https://github.com/catbee-technologies/catbee-container-studio/releases/latest'
              >
                Get CatBee Container Studio <span>↗</span>
              </Link>
              <p>Open source. Cross-platform. Built with Electron, Angular, and Dockerode.</p>
            </div>
          </div>
        </motion.section>
      </main>
    </Layout>
  );
}
