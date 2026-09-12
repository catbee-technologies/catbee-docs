import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import { motion, AnimatePresence } from 'framer-motion';
import MicrosoftButton from '@site/src/components/MicrosoftButton';
import MouseTrackingWrapper from '@site/src/components/MouseTrackingWrapper';
import CatbeeIcon from '@site/src/components/Icon';
import styles from './catbee-container-studio.module.scss';

const mediaPath = '/media/catbee-container-studio';

export type CategoryKey = 'all' | 'containers' | 'images' | 'volumes' | 'networks' | 'observability';

export interface StudioScreen {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: 'containers' | 'images' | 'volumes' | 'networks' | 'observability';
  categoryLabel: string;
  description: string;
  image: string;
  highlights: string[];
  badge?: string;
  icon: string;
}

export const studioScreens: StudioScreen[] = [
  {
    id: 'containers-list',
    number: '01',
    title: 'Container Dashboard & Fleet Control',
    subtitle: 'Live state, ports, grouped compose stacks, and one-click lifecycle actions',
    category: 'containers',
    categoryLabel: 'Containers',
    image: `${mediaPath}/1.containers-list.png`,
    icon: 'view_in_ar',
    badge: 'Fleet Control',
    description:
      'Monitor your active container ecosystem in a single calm operational view. Track status badges, exposed ports, memory utilization, and grouped compose stacks with instant start, stop, restart, and prune controls.',
    highlights: [
      'Real-time container status & health indicators',
      'Direct port mapping with clickable localhost links',
      'Instant start, restart, pause, stop, and terminate',
      'Grouped Docker Compose projects and standalone services'
    ]
  },
  {
    id: 'containers-logs',
    number: '02',
    title: 'Real-Time Streaming Logs',
    subtitle: 'ANSI-colored log stream with instant search, filters, and tail control',
    category: 'containers',
    categoryLabel: 'Containers',
    image: `${mediaPath}/2.containers-logs.png`,
    icon: 'terminal',
    badge: 'Live Logs',
    description:
      'Stream live application stdout and stderr in full ANSI color. Search with regex, filter out noisy levels, toggle auto-scroll, and copy log traces without jumping back and forth from terminal tabs.',
    highlights: [
      'Zero-lag streaming terminal output with ANSI colors',
      'Instant regex search filtering and term highlighting',
      'Auto-scroll lock and clear buffer controls',
      'One-click log snippet copying and trace inspection'
    ]
  },
  {
    id: 'containers-env',
    number: '03',
    title: 'Environment Variables Inspector',
    subtitle: 'Audit runtime parameters, configuration, and secret tokens safely',
    category: 'containers',
    categoryLabel: 'Containers',
    image: `${mediaPath}/3.containers-env.png`,
    icon: 'tune',
    badge: 'Configuration',
    description:
      'Inspect and verify all environment variables injected into the container runtime. Compare configurations between staging and local environments, inspect flags, and verify configuration without running bash scripts.',
    highlights: [
      'Clean key-value table formatting with quick search',
      'Safe copy for connection strings and API tokens',
      'Identifies image defaults vs compose overridden variables',
      'Zero risk of unintended terminal secret leakage'
    ]
  },
  {
    id: 'containers-mounts',
    number: '04',
    title: 'Mounts & Volume Bindings',
    subtitle: 'Inspect persistent storage maps, bind mounts, and read/write flags',
    category: 'containers',
    categoryLabel: 'Containers',
    image: `${mediaPath}/4.containers-mounts.png`,
    icon: 'folder_shared',
    badge: 'Storage Maps',
    description:
      'Gain transparent visibility into host directory bindings, named Docker volumes, and tmpfs mounts. Verify destination paths, read/write flags, and storage drivers in an instant.',
    highlights: [
      'Host source directory to container target path mappings',
      'Read-only vs Read-Write permission verification',
      'Direct shortcut to inspect attached named volumes',
      'Driver specification and volume propagation mode'
    ]
  },
  {
    id: 'containers-files',
    number: '05',
    title: 'In-Container File Explorer',
    subtitle: 'Browse, inspect, and extract files directly inside running containers',
    category: 'containers',
    categoryLabel: 'Containers',
    image: `${mediaPath}/5.containers-files.png`,
    icon: 'folder_open',
    badge: 'Direct Filesystem',
    description:
      'Explore container directories, inspect configuration files, verify file permissions, and check file sizes directly inside the container without typing a single `docker cp` or `cat` command.',
    highlights: [
      'Intuitive tree-view folder navigation inside containers',
      'Inspect file sizes, permission modes, and timestamps',
      'Directly view file contents inside the desktop studio',
      'Eliminates tedious `docker cp` and CLI shell navigation'
    ]
  },
  {
    id: 'containers-shell',
    number: '06',
    title: 'Embedded Interactive Terminal',
    subtitle: 'Direct `/bin/sh` or `/bin/bash` terminal sessions with full PTY support',
    category: 'containers',
    categoryLabel: 'Containers',
    image: `${mediaPath}/6.containers-shell.png`,
    icon: 'wysiwyg',
    badge: 'Embedded Shell',
    description:
      'Drop straight into a live interactive terminal session inside any container. Full PTY terminal support with keyboard shortcuts, command history, and automatic shell detection.',
    highlights: [
      '1-click shell launch into running containers',
      'Automatic detection of `/bin/bash`, `/bin/sh`, or custom shells',
      'Full ANSI color, responsive window resize, and interactive PTY',
      'No need to remember container IDs or open external terminals'
    ]
  },
  {
    id: 'containers-stats',
    number: '07',
    title: 'Real-Time Performance Pulse',
    subtitle: 'Live streaming telemetry for CPU %, Memory, Network I/O & Block I/O',
    category: 'containers',
    categoryLabel: 'Containers',
    image: `${mediaPath}/7.containers-stats.png`,
    icon: 'speed',
    badge: 'Telemetry Pulse',
    description:
      'Monitor live container health with dynamic streaming charts. Track CPU percentage, active memory vs configured memory limits, network throughput bytes, and disk block I/O in real time.',
    highlights: [
      'Live streaming CPU percentage and memory utilization charts',
      'Network I/O bytes received vs transmitted graphs',
      'Disk block read and write operation counters',
      'Ultra-lightweight background streaming with zero CPU overhead'
    ]
  },
  {
    id: 'images-list',
    number: '08',
    title: 'Image Inventory & Registry Hub',
    subtitle: 'Browse pulled and built images with tags, virtual sizes, and actions',
    category: 'images',
    categoryLabel: 'Images',
    image: `${mediaPath}/8.images-list.png`,
    icon: 'layers',
    badge: 'Image Fleet',
    description:
      'Catalog all local Docker images with visual repository tags, total virtual disk footprints, and creation timestamps. Launch new containers or prune unused images in a single click.',
    highlights: [
      'Visual repository and image tag hierarchy',
      'Accurate disk space and layer size metrics',
      'Instant 1-click Run dialog for any local image',
      'Clean up dangling and unused images safely'
    ]
  },
  {
    id: 'images-details',
    number: '09',
    title: 'Deep Layer & Metadata Inspector',
    subtitle: 'Inspect layer breakdown, history commands, ports, and image config',
    category: 'images',
    categoryLabel: 'Images',
    image: `${mediaPath}/9.images-details.png`,
    icon: 'data_object',
    badge: 'Layer Breakdown',
    description:
      'Inspect the inner anatomy of any Docker image. Step through build history commands, examine individual layer sizes, exposed ports, environment variables, and architecture details.',
    highlights: [
      'Detailed layer-by-layer size breakdown and caching analysis',
      'Dockerfile command history trace',
      'Exposed ports, user, and entrypoint configuration',
      'Image digest, OS architecture, and label verification'
    ]
  },
  {
    id: 'images-run',
    number: '10',
    title: 'Visual Container Launcher',
    subtitle: 'Intuitive wizard for port bindings, env vars, volumes, and restart policies',
    category: 'images',
    categoryLabel: 'Images',
    image: `${mediaPath}/10.images-run.png`,
    icon: 'play_arrow',
    badge: 'Launch Wizard',
    description:
      'Run containers from any image with an intuitive visual form. Configure host-to-container port bindings, volume mappings, environment variables, container names, and restart policies without syntax errors.',
    highlights: [
      'Form-based port binding configuration with conflict checks',
      'Add persistent volume mounts and directory binds easily',
      'Define custom container names and restart policies',
      'Eliminates long, error-prone `docker run -p -v -e` commands'
    ]
  },
  {
    id: 'volumes-list',
    number: '11',
    title: 'Volume Fleet Manager',
    subtitle: 'Inspect persistent Docker volumes, storage drivers, and attached containers',
    category: 'volumes',
    categoryLabel: 'Volumes',
    image: `${mediaPath}/11.volumes-list.png`,
    icon: 'storage',
    badge: 'Volume Fleet',
    description:
      'Manage persistent Docker volumes across your system. Identify which containers are currently attached, review volume drivers, and reclaim unused disk space safely.',
    highlights: [
      'Identifies mounted vs unmounted orphan volumes',
      'Storage driver and filesystem scope details',
      'Attached container cross-references',
      'Safe deletion of unused persistent volumes'
    ]
  },
  {
    id: 'volumes-files',
    number: '12',
    title: 'Direct Volume File Explorer',
    subtitle: 'Browse and inspect files inside Docker volumes directly from your desktop',
    category: 'volumes',
    categoryLabel: 'Volumes',
    image: `${mediaPath}/12.volumes-files.png`,
    icon: 'inventory_2',
    badge: 'Volume Explorer',
    description:
      'Directly browse files and folder hierarchies stored inside persistent Docker volumes. Inspect database files, uploaded assets, and application state without spinning up helper containers.',
    highlights: [
      'Direct filesystem exploration into named Docker volumes',
      'Inspect files without spinning up helper busybox containers',
      'Check nested folder structures, permissions, and file sizes',
      'Verify persistent databases and uploaded asset directories'
    ]
  },
  {
    id: 'networks-list',
    number: '13',
    title: 'Network Topologies Hub',
    subtitle: 'Overview of bridge, host, and overlay networks with subnets & gateways',
    category: 'networks',
    categoryLabel: 'Networks',
    image: `${mediaPath}/13.networks-list.png`,
    icon: 'lan',
    badge: 'Topologies',
    description:
      'Visualize and manage Docker networks. Check network drivers (bridge, host, macvlan, overlay), subnets, gateways, and internal isolation settings across all compose and custom networks.',
    highlights: [
      'Driver type and network scope overview',
      'Subnet CIDR blocks and default gateway IP mappings',
      'Internal network isolation status',
      'Fast search across custom and compose networks'
    ]
  },
  {
    id: 'networks-containers',
    number: '14',
    title: 'Network Connectivity & IP Routing',
    subtitle: 'Map connected containers, IP addresses, aliases, and MAC addresses',
    category: 'networks',
    categoryLabel: 'Networks',
    image: `${mediaPath}/14.networks-containers.png`,
    icon: 'hub',
    badge: 'IP Routing',
    description:
      'Inspect exactly which containers communicate on each network. See IPv4/IPv6 addresses, MAC addresses, endpoint IDs, and network aliases at a glance to diagnose connectivity issues in seconds.',
    highlights: [
      'Per-container IPv4 and IPv6 address resolution',
      'Container network aliases and endpoint IDs',
      'MAC address and virtual network interface details',
      'Verify network segregation and inter-service routing'
    ]
  },
  {
    id: 'global-logs',
    number: '15',
    title: 'Unified Global Log Aggregator',
    subtitle: 'Stream logs across all active containers in a single multi-service timeline',
    category: 'observability',
    categoryLabel: 'Observability',
    image: `${mediaPath}/15.global-logs.png`,
    icon: 'analytics',
    badge: 'Global Stream',
    description:
      'Aggregate and stream logs across your entire Docker fleet into a single unified timeline. Search keywords across all containers simultaneously to trace multi-service interactions and distributed bugs.',
    highlights: [
      'Multi-container simultaneous real-time log stream',
      'Color-coded container source badges for fast identification',
      'Fleet-wide instant keyword and regex search',
      'Correlate events across microservices and databases effortlessly'
    ]
  }
];

const tourModules = [
  { key: 'containers', label: 'Containers', icon: 'view_in_ar', count: 7, defaultId: 'containers-list' },
  { key: 'images', label: 'Images', icon: 'layers', count: 3, defaultId: 'images-list' },
  { key: 'volumes', label: 'Volumes', icon: 'storage', count: 2, defaultId: 'volumes-list' },
  { key: 'networks', label: 'Networks', icon: 'lan', count: 2, defaultId: 'networks-list' },
  { key: 'observability', label: 'Global Logs', icon: 'analytics', count: 1, defaultId: 'global-logs' }
];

const bentoFeatures = [
  {
    span: 'col-span-2',
    kicker: 'Storage & Internals',
    title: 'A True File Explorer for Docker',
    description:
      'Explore, inspect, and manage files inside running containers and persistent volumes just like a native desktop folder. No more assembly of docker cp commands or spinning up helper containers.',
    badge: 'Zero CLI Commands',
    image: `${mediaPath}/5.containers-files.png`,
    secondaryImage: `${mediaPath}/12.volumes-files.png`,
    tags: ['Container Filesystem', 'Volume Filesystem', 'Direct Inspection', 'Permission Auditing']
  },
  {
    span: 'col-span-1',
    kicker: 'Zero Latency',
    title: 'Real-Time Resource Pulse',
    description:
      'Dynamic streaming telemetry tracking CPU %, memory usage against limits, network throughput, and disk block I/O with negligible overhead.',
    badge: 'Live Telemetry',
    image: `${mediaPath}/7.containers-stats.png`,
    tags: ['CPU %', 'Memory Limits', 'Network I/O', 'Disk Stats']
  },
  {
    span: 'col-span-1',
    kicker: 'Direct Access',
    title: 'Interactive Embedded Shell',
    description:
      'Drop straight into `/bin/sh` or `/bin/bash` with full interactive PTY terminal support, command history, and responsive window resizing.',
    badge: '1-Click Shell',
    image: `${mediaPath}/6.containers-shell.png`,
    tags: ['PTY Support', 'Bash & Sh', 'ANSI Colors', 'One-Click Exec']
  },
  {
    span: 'col-span-1',
    kicker: 'Effortless Run',
    title: 'Visual Container Launcher',
    description:
      'Configure port bindings, volume mappings, environment variables, and restart policies visually in seconds with built-in validation.',
    badge: 'No Syntax Errors',
    image: `${mediaPath}/10.images-run.png`,
    tags: ['Port Validation', 'Volume Maps', 'Env Editor', 'Restart Policies']
  },
  {
    span: 'col-span-1',
    kicker: 'Networking Map',
    title: 'Network Topologies & IP Map',
    description:
      'Inspect which containers communicate on each network, resolve assigned IPv4/IPv6 addresses, MAC addresses, and verify isolation.',
    badge: 'Network Insights',
    image: `${mediaPath}/14.networks-containers.png`,
    tags: ['Subnets & Gateways', 'IP Mapping', 'Bridge & Host', 'Aliases']
  },
  {
    span: 'col-span-2',
    kicker: 'Fleet Observability',
    title: 'Unified Multi-Container Global Logs',
    description:
      'Aggregate stdout and stderr across all your active containers into a unified timeline. Search keywords fleet-wide to trace microservice issues effortlessly.',
    badge: 'Fleet-Wide Search',
    image: `${mediaPath}/15.global-logs.png`,
    tags: ['Multi-Service Stream', 'Color-Coded Badges', 'Global Search', 'Distributed Tracing']
  }
];

export default function ContainerStudioPage(): ReactNode {
  const [activeTourId, setActiveTourId] = useState<string>('containers-list');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [releaseInfo, setReleaseInfo] = useState<{
    version: string;
    publishedDate?: string;
    releaseUrl?: string;
    loading: boolean;
  }>({
    version: 'v0.3.1',
    releaseUrl: 'https://github.com/catbee-technologies/catbee-container-studio/releases/latest',
    loading: true
  });

  const activeTourScreen = studioScreens.find(s => s.id === activeTourId) ?? studioScreens[0];
  const activeTourModuleKey = activeTourScreen.category;
  const currentModuleScreens = studioScreens.filter(s => s.category === activeTourModuleKey);

  const currentScreenIndex = currentModuleScreens.findIndex(s => s.id === activeTourId);
  const safeCurrentIndex = currentScreenIndex !== -1 ? currentScreenIndex : 0;

  const goToPrevTourScreen = useCallback(() => {
    const prevIdx = (safeCurrentIndex - 1 + currentModuleScreens.length) % currentModuleScreens.length;
    setActiveTourId(currentModuleScreens[prevIdx].id);
  }, [safeCurrentIndex, currentModuleScreens]);

  const goToNextTourScreen = useCallback(() => {
    const nextIdx = (safeCurrentIndex + 1) % currentModuleScreens.length;
    setActiveTourId(currentModuleScreens[nextIdx].id);
  }, [safeCurrentIndex, currentModuleScreens]);

  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartXRef.current === null || touchStartYRef.current === null) return;
      const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
      const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

      // Minimum horizontal swipe distance of 35px, and must be predominantly horizontal
      if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
        if (deltaX < 0) {
          goToNextTourScreen();
        } else {
          goToPrevTourScreen();
        }
      }
      touchStartXRef.current = null;
      touchStartYRef.current = null;
    },
    [goToNextTourScreen, goToPrevTourScreen]
  );

  useEffect(() => {
    fetch('https://api.github.com/repos/catbee-technologies/catbee-container-studio/releases/latest')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch release');
        return res.json();
      })
      .then(data => {
        if (data?.tag_name) {
          setReleaseInfo({
            version: data.tag_name,
            publishedDate: data.published_at
              ? new Date(data.published_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })
              : undefined,
            releaseUrl:
              data.html_url || 'https://github.com/catbee-technologies/catbee-container-studio/releases/latest',
            loading: false
          });
        }
      })
      .catch(() => {
        setReleaseInfo(prev => ({ ...prev, loading: false }));
      });
  }, []);

  const openLightbox = useCallback((id: string) => {
    const idx = studioScreens.findIndex(s => s.id === id);
    if (idx !== -1) {
      setLightboxIndex(idx);
    }
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const nextLightboxImage = useCallback(() => {
    setLightboxIndex(prev => (prev === null ? null : (prev + 1) % studioScreens.length));
  }, []);

  const prevLightboxImage = useCallback(() => {
    setLightboxIndex(prev => (prev === null ? null : (prev - 1 + studioScreens.length) % studioScreens.length));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightboxImage();
      if (e.key === 'ArrowLeft') prevLightboxImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, closeLightbox, nextLightboxImage, prevLightboxImage]);

  return (
    <Layout
      title='CatBee Container Studio'
      description='A focused desktop control room for Docker containers, images, volumes, networks, and files.'
    >
      <main className={styles.page}>
        {/* ================= HERO SECTION ================= */}
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
                containers, images, volumes, networks, and files without losing your flow to the command line.
              </p>

              <div className={styles.heroActions}>
                <Link
                  className={styles.primaryButton}
                  href={
                    releaseInfo.releaseUrl ??
                    'https://github.com/catbee-technologies/catbee-container-studio/releases/latest'
                  }
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Download the latest <span>↗</span>
                </Link>
                <MicrosoftButton className={styles.fullWidthBtn} />
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
                <button
                  type='button'
                  className={styles.imageTriggerBtn}
                  onClick={() => openLightbox('containers-list')}
                  aria-label='Inspect Containers List in fullscreen'
                >
                  <img
                    src={`${mediaPath}/1.containers-list.png`}
                    alt='CatBee Container Studio showing a list of running Docker containers'
                  />
                </button>
              </MouseTrackingWrapper>
              <div className={styles.visualNote}>Monitor and manage Docker resources from one desktop app.</div>
            </motion.div>
          </div>
        </section>

        {/* ================= VALUE TICKER ================= */}
        <section className={styles.tickerSection}>
          <div className={clsx('container', styles.tickerGrid)}>
            <div className={styles.tickerCard}>
              <div className={styles.tickerIcon}>
                <CatbeeIcon name='bolt' size='medium' />
              </div>
              <div className={styles.tickerText}>
                <Heading as='h4'>Zero-Command Flow</Heading>
                <p>Start, stop, restart, inspect, and configure resources with single-click precision.</p>
              </div>
            </div>

            <div className={styles.tickerCard}>
              <div className={styles.tickerIcon}>
                <CatbeeIcon name='folder' size='medium' />
              </div>
              <div className={styles.tickerText}>
                <Heading as='h4'>Direct In-Container Files</Heading>
                <p>Explore and inspect files inside containers and volumes like local desktop folders.</p>
              </div>
            </div>

            <div className={styles.tickerCard}>
              <div className={styles.tickerIcon}>
                <CatbeeIcon name='show_chart' size='medium' />
              </div>
              <div className={styles.tickerText}>
                <Heading as='h4'>Live Telemetry Graphs</Heading>
                <p>Stream real-time CPU %, memory consumption, and network I/O with zero lag.</p>
              </div>
            </div>

            <div className={styles.tickerCard}>
              <div className={styles.tickerIcon}>
                <CatbeeIcon name='shield' size='medium' />
              </div>
              <div className={styles.tickerText}>
                <Heading as='h4'>100% Local & Private</Heading>
                <p>Direct Docker socket connection with zero external servers and zero telemetry leakage.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= INTERACTIVE STUDIO TOUR ================= */}
        <section className={styles.tourSection}>
          <div className={clsx('container', styles.tourContainer)}>
            <div className={styles.tourHeader}>
              <div className={styles.sectionKicker}>Interactive Product Experience</div>
              <Heading as='h2'>
                Explore all 15 dimensions
                <br />
                <span>of Container Studio.</span>
              </Heading>
              <p className={styles.tourLead}>
                Click through the modules below to inspect how Container Studio replaces messy CLI flags with a calm,
                unified desktop cockpit.
              </p>
            </div>

            {/* Tour Module Tabs */}
            <div className={styles.tourModuleTabsWrapper}>
              <div className={styles.tourModuleTabs}>
                {tourModules.map(module => {
                  const isActive = activeTourModuleKey === module.key;
                  return (
                    <button
                      key={module.key}
                      type='button'
                      className={clsx(styles.tourModuleButton, isActive && styles.tourModuleActive)}
                      onClick={() => setActiveTourId(module.defaultId)}
                    >
                      <CatbeeIcon name={module.icon} size='small' />
                      <span>{module.label}</span>
                      <span className={styles.moduleCountBadge}>{module.count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sub-screen Selectors */}
            <div className={styles.tourSubNavWrapper}>
              <div className={styles.tourSubNav}>
                {currentModuleScreens.map(scr => {
                  const isSelected = scr.id === activeTourId;
                  return (
                    <button
                      key={scr.id}
                      type='button'
                      className={clsx(styles.subScreenChip, isSelected && styles.subScreenChipActive)}
                      onClick={() => setActiveTourId(scr.id)}
                    >
                      <span className={styles.chipNum}>{scr.number}</span>
                      <span>{scr.title.split('&')[0].trim()}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Showcase Window */}
            <div className={styles.tourShowcaseCard}>
              <div className={styles.tourWindowChrome}>
                <div className={styles.windowControls}>
                  <span className={styles.controlClose} />
                  <span className={styles.controlMinimize} />
                  <span className={styles.controlMaximize} />
                </div>
                <div className={styles.tourWindowTitle}>
                  <span>{activeTourScreen.categoryLabel}</span>
                  <span className={styles.titleDivider}>/</span>
                  <strong>{activeTourScreen.title}</strong>
                </div>
                <button
                  type='button'
                  className={styles.fullscreenTrigger}
                  onClick={() => openLightbox(activeTourScreen.id)}
                  title='Open full-screen image'
                  aria-label='Open full-screen image'
                >
                  <CatbeeIcon name='fullscreen' size='small' />
                </button>
              </div>

              <div className={styles.tourDisplayGrid}>
                <div className={styles.tourImageContainer} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                  <div className={styles.tourImageStage}>
                    <button
                      type='button'
                      className={clsx(styles.tourImageArrow, styles.tourImageArrowLeft)}
                      onClick={e => {
                        e.stopPropagation();
                        goToPrevTourScreen();
                      }}
                      aria-label='Previous screen'
                      title='Previous screen'
                    >
                      <CatbeeIcon name='chevron_left' size='medium' />
                    </button>

                    <button
                      type='button'
                      className={styles.tourImageWrapper}
                      onClick={() => openLightbox(activeTourScreen.id)}
                      aria-label={`Open ${activeTourScreen.title} in fullscreen`}
                    >
                      <AnimatePresence mode='wait'>
                        <motion.img
                          key={activeTourScreen.id}
                          src={activeTourScreen.image}
                          alt={activeTourScreen.title}
                          className={styles.tourImage}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.22, ease: 'easeInOut' }}
                          loading='lazy'
                        />
                      </AnimatePresence>
                    </button>

                    <button
                      type='button'
                      className={clsx(styles.tourImageArrow, styles.tourImageArrowRight)}
                      onClick={e => {
                        e.stopPropagation();
                        goToNextTourScreen();
                      }}
                      aria-label='Next screen'
                      title='Next screen'
                    >
                      <CatbeeIcon name='chevron_right' size='medium' />
                    </button>

                    {/* Carousel Dots */}
                    <div className={styles.tourCarouselDots}>
                      {currentModuleScreens.map(scr => (
                        <button
                          key={scr.id}
                          type='button'
                          className={clsx(styles.tourDot, scr.id === activeTourId && styles.tourDotActive)}
                          onClick={() => setActiveTourId(scr.id)}
                          aria-label={`Go to ${scr.title}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className={styles.tourMetaPanel}>
                  <div className={styles.tourMetaBadge}>
                    <CatbeeIcon name={activeTourScreen.icon} size='small' />
                    <span>{activeTourScreen.badge ?? activeTourScreen.categoryLabel}</span>
                  </div>

                  <Heading as='h3' className={styles.tourMetaTitle}>
                    {activeTourScreen.title}
                  </Heading>

                  <p className={styles.tourMetaSubtitle}>{activeTourScreen.subtitle}</p>

                  <p className={styles.tourMetaDesc}>{activeTourScreen.description}</p>

                  <div className={styles.tourHighlightsBlock}>
                    <div className={styles.highlightsHeader}>Key Capabilities:</div>
                    <ul className={styles.highlightsList}>
                      {activeTourScreen.highlights.map((h, i) => (
                        <li key={i}>
                          <CatbeeIcon name='check_circle' size='small' />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.tourMetaActions}>
                    <button
                      type='button'
                      className={styles.primaryButton}
                      onClick={() => openLightbox(activeTourScreen.id)}
                    >
                      Inspect in Fullscreen <span>↗</span>
                    </button>
                    <span className={styles.shortcutHint}>{activeTourScreen.number} of 15</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SUPERPOWERS BENTO GRID ================= */}
        <section className={styles.bentoSection}>
          <div className={clsx('container', styles.bentoInner)}>
            <div className={styles.bentoHeader}>
              <div className={styles.sectionKicker}>Engineered for Speed</div>
              <Heading as='h2'>
                Built to solve the real frustrations
                <br />
                <span>of Docker development.</span>
              </Heading>
              <p>
                From in-container filesystem exploration to unified global log streams, Container Studio eliminates the
                friction of containerized development.
              </p>
            </div>

            <div className={styles.bentoGrid}>
              {bentoFeatures.map((bento, index) => (
                <motion.article
                  key={index}
                  className={clsx(styles.bentoCard, styles[bento.span])}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.65, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className={styles.bentoCardTop}>
                    <div className={styles.bentoKicker}>{bento.kicker}</div>
                    <span className={styles.bentoBadge}>{bento.badge}</span>
                  </div>

                  <Heading as='h3' className={styles.bentoTitle}>
                    {bento.title}
                  </Heading>
                  <p className={styles.bentoDesc}>{bento.description}</p>

                  <div className={styles.bentoTags}>
                    {bento.tags.map(tag => (
                      <span key={tag} className={styles.bentoTag}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className={styles.bentoMediaWrap}>
                    <MouseTrackingWrapper
                      initialX={50}
                      initialY={50}
                      resetOnLeave={false}
                      smoothing={0.2}
                      className={styles.bentoMedia}
                    >
                      <button
                        type='button'
                        className={styles.imageTriggerBtn}
                        onClick={() => openLightbox(studioScreens.find(s => s.image === bento.image)?.id ?? '')}
                        aria-label={`Inspect ${bento.title} in fullscreen`}
                      >
                        <img src={bento.image} alt={bento.title} loading='lazy' />
                      </button>
                    </MouseTrackingWrapper>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* ================= ARCHITECTURE & TECH SPECS ================= */}
        <section className={styles.techSpecsSection}>
          <div className={clsx('container', styles.techSpecsInner)}>
            <div className={styles.techSpecsHeader}>
              <div className={styles.sectionKicker}>Built for Developer Trust</div>
              <Heading as='h2'>
                Engineered for speed,
                <br />
                <span>privacy, and reliability.</span>
              </Heading>
              <p>
                CatBee Container Studio is designed as a direct desktop interface. No cloud proxies, no required
                accounts, and no telemetry tracking your containers.
              </p>
            </div>

            <div className={styles.specsGrid}>
              <div className={styles.specCard}>
                <div className={styles.specIcon}>
                  <CatbeeIcon name='devicon-electron-original' size='large' />
                </div>
                <Heading as='h3'>Electron + Angular Architecture</Heading>
                <p>
                  High-performance desktop shell powered by Angular’s modern reactivity and Electron’s native OS
                  integration. Low idle memory and instantaneous view switching.
                </p>
              </div>

              <div className={styles.specCard}>
                <div className={styles.specIcon}>
                  <CatbeeIcon name='devicon-docker-plain' size='large' />
                </div>
                <Heading as='h3'>Direct Engine Socket</Heading>
                <p>
                  Communicates directly through local Docker daemon sockets (`/var/run/docker.sock` on Linux/macOS or
                  `\\.\pipe\docker_engine` on Windows). No intermediaries.
                </p>
              </div>

              <div className={styles.specCard}>
                <div className={styles.specIcon}>
                  <CatbeeIcon name='lock' size='large' />
                </div>
                <Heading as='h3'>100% Offline & Private</Heading>
                <p>
                  Your images, environment variables, secret tokens, and volume data remain entirely local on your
                  workstation. Zero external telemetry or cloud analytics.
                </p>
              </div>

              <div className={styles.specCard}>
                <div className={styles.specIcon}>
                  <CatbeeIcon name='devices' size='large' />
                </div>
                <Heading as='h3'>Universal Compatibility</Heading>
                <p>
                  Works out of the box with Docker Desktop, Rancher Desktop, Colima, Podman, or standalone rootless
                  Docker installations on Windows, macOS, and Linux.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= DOWNLOAD CALL TO ACTION ================= */}
        <section className={styles.downloadBand}>
          <div className={clsx('container', styles.download)}>
            <div className={styles.downloadContent}>
              <div className={styles.sectionKicker}>Get Started Today</div>
              <Heading as='h2'>
                Take full control of Docker
                <br />
                <span>from your desktop.</span>
              </Heading>
              <p className={styles.downloadLead}>
                Available for Windows, macOS, and Linux. Free and open source under the MIT License.
              </p>

              <div className={styles.downloadActions}>
                <Link
                  className={styles.primaryButton}
                  href={
                    releaseInfo.releaseUrl ??
                    'https://github.com/catbee-technologies/catbee-container-studio/releases/latest'
                  }
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Download for Desktop <span>↗</span>
                </Link>
                <MicrosoftButton className={styles.fullWidthBtn} />
                <Link
                  className={styles.outlineButton}
                  href='https://github.com/catbee-technologies/catbee-container-studio'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <CatbeeIcon name='devicon-github-original' size='small' />
                  <span>Source Code</span>
                </Link>
              </div>
            </div>

            <div className={styles.downloadBadgesCard}>
              <div className={styles.badgeCardHeader}>
                <CatbeeIcon name='verified' size='small' />
                <span>Release Information</span>
              </div>
              <ul className={styles.releaseList}>
                <li>
                  <span>Latest Release</span>
                  <Link
                    href={
                      releaseInfo.releaseUrl ??
                      'https://github.com/catbee-technologies/catbee-container-studio/releases/latest'
                    }
                    target='_blank'
                    rel='noopener noreferrer'
                    className={styles.releaseBadgeLink}
                  >
                    <strong>{releaseInfo.version}</strong>
                    <span className={styles.releaseBadgeArrow}>↗</span>
                  </Link>
                </li>
                {releaseInfo.publishedDate && (
                  <li>
                    <span>Published</span>
                    <strong>{releaseInfo.publishedDate}</strong>
                  </li>
                )}
                <li>
                  <span>License</span>
                  <strong>MIT Open Source</strong>
                </li>
                <li>
                  <span>Platforms</span>
                  <strong>Windows • macOS • Linux</strong>
                </li>
                <li>
                  <span>Framework</span>
                  <strong>Electron • Angular • Dockerode</strong>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ================= HIGH-DEFINITION FULLSCREEN LIGHTBOX MODAL ================= */}
        <AnimatePresence>
          {lightboxIndex !== null && (
            <motion.div
              className={styles.lightboxBackdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLightbox}
            >
              <motion.div
                className={styles.lightboxModal}
                initial={{ scale: 0.94, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.94, opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                onClick={e => e.stopPropagation()}
              >
                {/* Lightbox Top Bar */}
                <div className={styles.lightboxHeader}>
                  <div className={styles.lightboxTitleInfo}>
                    <span className={styles.lightboxIndexBadge}>
                      {studioScreens[lightboxIndex].number} of {studioScreens.length}
                    </span>
                    <strong className={styles.lightboxTitleText}>{studioScreens[lightboxIndex].title}</strong>
                    <span className={styles.lightboxCategoryTag}>{studioScreens[lightboxIndex].categoryLabel}</span>
                  </div>

                  <div className={styles.lightboxActions}>
                    <button
                      type='button'
                      className={styles.lightboxCloseBtn}
                      onClick={closeLightbox}
                      title='Close preview (Esc)'
                      aria-label='Close preview'
                    >
                      <CatbeeIcon name='close' size='small' />
                    </button>
                  </div>
                </div>

                {/* Lightbox Media Stage */}
                <div className={styles.lightboxMediaStage}>
                  <button
                    type='button'
                    className={clsx(styles.lightboxNavBtn, styles.lightboxPrevBtn)}
                    onClick={e => {
                      e.stopPropagation();
                      prevLightboxImage();
                    }}
                    title='Previous image (Left arrow)'
                  >
                    <CatbeeIcon name='chevron_left' size='large' />
                  </button>

                  <div className={styles.lightboxImageContainer}>
                    <img
                      src={studioScreens[lightboxIndex].image}
                      alt={studioScreens[lightboxIndex].title}
                      className={styles.lightboxImage}
                    />
                  </div>

                  <button
                    type='button'
                    className={clsx(styles.lightboxNavBtn, styles.lightboxNextBtn)}
                    onClick={e => {
                      e.stopPropagation();
                      nextLightboxImage();
                    }}
                    title='Next image (Right arrow)'
                  >
                    <CatbeeIcon name='chevron_right' size='large' />
                  </button>
                </div>

                {/* Lightbox Footer Details */}
                <div className={styles.lightboxFooter}>
                  <div className={styles.lightboxDescWrap}>
                    <p className={styles.lightboxDescription}>{studioScreens[lightboxIndex].description}</p>
                    <div className={styles.lightboxHighlightsPills}>
                      {studioScreens[lightboxIndex].highlights.map((h, i) => (
                        <span key={i} className={styles.lightboxHighlightPill}>
                          <CatbeeIcon name='check' size='small' />
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={styles.lightboxShortcutInfo}>Use ← and → arrow keys to navigate, Esc to close</div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </Layout>
  );
}
