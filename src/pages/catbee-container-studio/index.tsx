import { useState, useEffect, useCallback, useRef, useSyncExternalStore, type ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import { motion, AnimatePresence } from 'framer-motion';
import MicrosoftButton from '@site/src/components/MicrosoftButton';
import MouseTrackingWrapper from '@site/src/components/MouseTrackingWrapper';
import CatbeeIcon from '@site/src/components/Icon';
import styles from './catbee-container-studio.module.scss';
import { ContainerStudioConfig, type PlatformKey } from './config';

const mediaPath = '/media/catbee-container-studio';

const subscribeOS = () => () => {};
const getClientOSSnapshot = (): PlatformKey => ContainerStudioConfig.detectOS();
const getServerOSSnapshot = (): PlatformKey => 'windows';

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
      'Monitor your active container ecosystem in a unified operational cockpit. Track real-time status badges, published port shortcuts, CPU and memory progress bars, and automatically grouped Docker Compose projects with aggregate metrics and instant start, stop, restart, or force recreate actions.',
    highlights: [
      'Docker Compose project grouping with aggregate CPU and memory metrics',
      'Force recreate for individual containers, selected containers, or Compose groups',
      'Visual CPU and memory progress bars with real-time utilization tracking',
      'Interactive published port pills with quick-launch browser links',
      'Quick filters for running containers and Kubernetes-managed services',
      'Multi-selection with shift-click range select and resizable persistent columns'
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
      'Stream live application stdout and stderr with high-performance virtualized scrolling in full ANSI color. Search with regex, case-matching, and whole-word toggles, click hyperlinks directly inside output lines, hover-highlight log entries, and adjust restart policies or published ports from the unified summary header.',
    highlights: [
      'Zero-lag streaming terminal output with ANSI colors and line hover highlights',
      'Instant regex search, case-sensitive (Aa), and whole-word (W) filters',
      'Directly clickable hyperlinks in logs for docs, tracing, and URLs',
      'Auto-scroll follow lock, buffer clear, and one-click log trace copying',
      'Unified header with live restart policy dropdown and port mapping editors'
    ]
  },
  {
    id: 'containers-env',
    number: '03',
    title: 'Environment Variables Editor & Inspector',
    subtitle: 'Inspect, edit, paste .env files, and safely recreate containers with updated variables',
    category: 'containers',
    categoryLabel: 'Containers',
    image: `${mediaPath}/3.containers-env.png`,
    icon: 'tune',
    badge: 'Env & Recreation',
    description:
      'Inspect, search, copy, add, edit, or remove environment variables injected into the container runtime. Paste full .env files directly, preview variable diffs, and save changes with safe container recreation and rollback protection.',
    highlights: [
      'Interactive key-value variable editor with direct raw .env file paste support',
      'Safe Docker Engine container recreation preserving volumes and ports',
      'Automatic rollback protection if recreation or startup encounters an error',
      'Clean key-value table formatting with instant search and one-click copy',
      'Unsaved changes guard protecting drafts when navigating away or switching tabs'
    ]
  },
  {
    id: 'containers-mounts',
    number: '04',
    title: 'Mounts, Volumes & Storage Bindings',
    subtitle: 'Redesigned mount cards, in-place mount editing, and one-click file navigation',
    category: 'containers',
    categoryLabel: 'Containers',
    image: `${mediaPath}/4.containers-mounts.png`,
    icon: 'folder_shared',
    badge: 'Storage Maps',
    description:
      'Gain transparent visibility into host directory bind mounts, named volumes, and declared paths with summary counters (attached, read/write, read-only, declared). Edit mounts in place with host directory selection, jump directly to volume details, or click any container path to navigate straight into the Files browser.',
    highlights: [
      'Source-to-destination cards with volume links and one-click navigation to Files',
      'Summary metrics for attached mounts, read/write flags, and declared paths',
      'In-place Edit Mounts dialog with host directory picker and container recreation',
      'Engine recreation safety preserving image IDs and anonymous volume sources',
      'Direct navigation to destination folder inside container Files tab'
    ]
  },
  {
    id: 'containers-files',
    number: '05',
    title: 'In-Container Files Explorer & Monaco Editor',
    subtitle: 'Browse directories, inspect permissions, and edit files in-app with Monaco Editor',
    category: 'containers',
    categoryLabel: 'Containers',
    image: `${mediaPath}/5.containers-files.png`,
    icon: 'folder_open',
    badge: 'Files & Monaco',
    description:
      'Explore the full container filesystem with breadcrumbs, sorting, and search. View and edit configuration files in-app using the integrated Monaco Editor with syntax highlighting, inspect file permissions and sizes, delete files, or jump straight from mounts into target file destinations.',
    highlights: [
      'Integrated Monaco Editor for syntax-highlighted in-container file viewing and editing',
      'Breadcrumb path navigation with copyable paths and instant folder filtering',
      'File permission modes (e.g., rwxr-xr-x), exact sizes, timestamps, and deletion',
      'Auto-selection and scroll-into-view when navigated from container mounts',
      'Symlink recognition without following to prevent circular locks'
    ]
  },
  {
    id: 'containers-shell',
    number: '06',
    title: 'Embedded Interactive Terminal',
    subtitle: 'Direct /bin/sh or /bin/bash terminal sessions with full PTY support',
    category: 'containers',
    categoryLabel: 'Containers',
    image: `${mediaPath}/6.containers-shell.png`,
    icon: 'wysiwyg',
    badge: 'Embedded Shell',
    description:
      'Drop straight into an interactive terminal session inside any container. Built with xterm.js featuring full PTY emulation, terminal text search, live connection indicators, reconnect controls, and automatic shell detection (/bin/bash, /bin/sh).',
    highlights: [
      '1-click interactive shell launch powered by xterm.js',
      'Built-in terminal text search (Find in terminal)',
      'Live connection status indicator and one-click Reconnect button',
      'Automatic detection of /bin/bash, /bin/sh, or custom container shells',
      'Full ANSI colors, keyboard navigation, copy/paste, and responsive resizing'
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
      'Monitor live container resource consumption with dynamic streaming charts. Track CPU percentage, active memory against configured limits, network throughput (Rx/Tx MB), and disk block I/O (Read/Write MB) with intelligent background throttling.',
    highlights: [
      'Live streaming CPU % chart with instant utilization metrics',
      'Memory usage curve with threshold boundaries and percentage tracking',
      'Real-time Network I/O throughput (Rx and Tx megabytes)',
      'Disk Block I/O tracking read and write bandwidth',
      'Throttled background polling when window is hidden to save host CPU'
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
      'Catalog all local Docker images with repository names, tags, copyable IDs, virtual disk footprints, and relative creation ages. Pull images from registries, filter by usage, launch containers, or prune dangling images safely.',
    highlights: [
      'Total fleet size metrics and aggregate image counters',
      'Segmented status filtering: All, Used, Unused, and Dangling',
      'Pull images directly from Docker Hub or private container registries',
      '1-click container launch dialog for any local image',
      'Bulk selection and safe cleanup of dangling or unreferenced images'
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
      'Inspect the anatomy of any Docker image with unified metadata cards. Step through layer-by-layer build commands with sizes, inspect architecture (OS / Arch), entrypoints, CMD, and discover all containers currently using the image.',
    highlights: [
      'Unified details summary with repository, tag, size, ID, and quick Run action',
      'Detailed layer-by-layer size breakdown and Dockerfile build command history',
      'System metadata cards: OS/Arch, entrypoint, default CMD, and creation time',
      'Containers Using This Image tab to audit running dependencies before deletion'
    ]
  },
  {
    id: 'images-run',
    number: '10',
    title: 'Visual Container Launcher',
    subtitle: 'Form-based runner with port mappings, volume maps, and env editor',
    category: 'images',
    categoryLabel: 'Images',
    image: `${mediaPath}/10.images-run.png`,
    icon: 'play_arrow',
    badge: 'Launch Wizard',
    description:
      'Create and start containers directly from any image with an intuitive dialog. Configure port mappings with conflict checks, persistent volume binds, environment variables with raw .env paste support, and custom container names.',
    highlights: [
      'Port mappings editor with duplicate binding checks and random host port (0) support',
      'Volume mappings editor with host path picker, container path, and read-only toggle',
      'Environment variables editor with key-value pairs and direct .env file paste',
      'Confirmation guard protecting unsaved creation drafts from accidental navigation',
      'Eliminates error-prone docker run terminal commands'
    ]
  },
  {
    id: 'volumes-list',
    number: '11',
    title: 'Volume Fleet Manager & Creation',
    subtitle: 'Manage persistent Docker volumes, create named volumes, and track usage',
    category: 'volumes',
    categoryLabel: 'Volumes',
    image: `${mediaPath}/11.volumes-list.png`,
    icon: 'storage',
    badge: 'Volume Fleet',
    description:
      'Manage persistent Docker volumes across your system. Create named volumes with custom drivers and optional host directory paths, calculate accurate disk space, filter by usage, and prune unused volumes safely.',
    highlights: [
      'Create named Docker volumes with custom driver and host directory options',
      'Total fleet size calculation and per-volume disk consumption',
      'Segmented status filter: All, In Use, and Unused volumes',
      'One-click Prune Unused button to reclaim disk space safely',
      'Quick identification of attached containers and volume drivers'
    ]
  },
  {
    id: 'volumes-files',
    number: '12',
    title: 'Direct Volume Files Explorer & Monaco Editor',
    subtitle: 'Browse and edit files inside Docker volumes directly from your desktop',
    category: 'volumes',
    categoryLabel: 'Volumes',
    image: `${mediaPath}/12.volumes-files.png`,
    icon: 'inventory_2',
    badge: 'Volume Explorer',
    description:
      'Directly browse folder hierarchies and edit files stored inside persistent Docker volumes. Inspect volume metadata (driver, mountpoint, created, ref count) and view or modify file contents in-app using Monaco Editor without helper containers.',
    highlights: [
      'Direct filesystem navigation into named Docker volumes without helper containers',
      'In-app file viewing and editing powered by the integrated Monaco Editor',
      'Unified volume details header with total size, mountpoint path, and reference counts',
      'Breadcrumb path navigation, folder filtering, and safe file deletion',
      'Audit persistent database configs and uploaded files on your host'
    ]
  },
  {
    id: 'networks-list',
    number: '13',
    title: 'Network Topologies & Network Creation',
    subtitle: 'Inspect bridge, host, and overlay networks, subnets, and create custom networks',
    category: 'networks',
    categoryLabel: 'Networks',
    image: `${mediaPath}/13.networks-list.png`,
    icon: 'lan',
    badge: 'Topologies',
    description:
      'Visualize, create, and manage Docker networks. Create custom networks with driver selection, custom subnets, gateways, and IP ranges. Inspect connected container counts, driver types, and IPAM mappings.',
    highlights: [
      'Create custom Docker networks with driver, subnet, gateway, and IP range options',
      'Driver badges (BRIDGE, NULL, HOST, OVERLAY) and network scope details',
      'Subnet CIDR blocks and default gateway IP mappings',
      'Segmented filters: All, In Use, Unused, and one-click Prune Unused',
      'Unsaved network creation draft protection against accidental closure'
    ]
  },
  {
    id: 'networks-containers',
    number: '14',
    title: 'Network Connectivity & Connected Containers',
    subtitle: 'Map connected containers, IP addresses, aliases, and MAC addresses',
    category: 'networks',
    categoryLabel: 'Networks',
    image: `${mediaPath}/14.networks-containers.png`,
    icon: 'hub',
    badge: 'IP Routing',
    description:
      'Inspect connected services on each network in a dedicated table layout. Review container running states, short IDs, image tags, assigned IPv4 addresses with CIDR masks (e.g. 172.18.0.x/16), and uptimes to diagnose inter-service routing.',
    highlights: [
      'Dedicated connected containers table with live running status indicators',
      'Per-container IPv4 address and CIDR prefix resolution',
      'Unified network summary header with driver, container count, and internal flag',
      'Network configuration tab for deep driver and IPAM inspection',
      'Verify network segregation and resolve multi-service communication bugs'
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
      'Aggregate and stream logs across all active containers into a unified real-time timeline. Select specific containers from the filter drawer, search with regex, case-matching, and whole-word toggles, click external URLs, and trace distributed issues.',
    highlights: [
      'Fleet-wide concurrent real-time log aggregation with configurable line buffer',
      'Color-coded container badges for instant source identification',
      'Container selection drawer to filter logs by specific services or compose stacks',
      'Search toolbar with case sensitivity (Aa), whole word (W), and regex (.*)',
      'Clickable links, hover line highlighting, follow lock, and one-click copy'
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
    title: 'Files Explorer & In-App Monaco Editor',
    description:
      'Explore, inspect, edit, and manage files inside running containers and persistent volumes directly from your desktop with the integrated Monaco Editor. No `docker cp` commands or temporary helper containers needed.',
    badge: 'Monaco Editor Inside',
    image: `${mediaPath}/5.containers-files.png`,
    secondaryImage: `${mediaPath}/12.volumes-files.png`,
    tags: ['In-Container Files', 'Volume Filesystem', 'Monaco Editor', 'Live In-App Editing']
  },
  {
    span: 'col-span-1',
    kicker: 'Zero Latency',
    title: 'Real-Time Resource Pulse',
    description:
      'Live streaming telemetry tracking CPU %, memory against configured limits, network throughput, and disk block I/O with automatic background throttling.',
    badge: 'Live Telemetry',
    image: `${mediaPath}/7.containers-stats.png`,
    tags: ['CPU %', 'Memory Limits', 'Network I/O', 'Disk Stats']
  },
  {
    span: 'col-span-1',
    kicker: 'Direct Access',
    title: 'Interactive Terminal & Search',
    description:
      'Drop straight into `/bin/sh` or `/bin/bash` with full xterm.js PTY emulation, built-in terminal text search, reconnect button, and live connection status.',
    badge: 'PTY Shell + Search',
    image: `${mediaPath}/6.containers-shell.png`,
    tags: ['xterm.js PTY', 'Terminal Search', 'ANSI Colors', 'One-Click Exec']
  },
  {
    span: 'col-span-1',
    kicker: 'Safe Configuration',
    title: 'Live Env & Mount Recreation',
    description:
      'Edit environment variables (with raw `.env` paste) and volume mounts directly. Apply changes via safe Docker Engine recreation with automatic rollback protection.',
    badge: 'Rollback Protection',
    image: `${mediaPath}/3.containers-env.png`,
    tags: ['Raw .env Paste', 'Mount Bindings', 'Safe Recreation', 'Rollback Guard']
  },
  {
    span: 'col-span-1',
    kicker: 'Fleet Control',
    title: 'Compose Stacks & Group Metrics',
    description:
      'Group containers by Docker Compose projects with aggregate CPU & memory metrics, coordinated start/stop/restart, and Compose-aware force recreation.',
    badge: 'Compose Aware',
    image: `${mediaPath}/1.containers-list.png`,
    tags: ['Compose Grouping', 'Aggregate Metrics', 'Force Recreate', 'Shift-Click Select']
  },
  {
    span: 'col-span-2',
    kicker: 'Fleet Observability',
    title: 'Unified Multi-Container Global Logs',
    description:
      'Stream stdout and stderr across all active containers into a unified timeline. Filter by container, search with regex, click URLs, and correlate distributed microservice events.',
    badge: 'Fleet-Wide Search',
    image: `${mediaPath}/15.global-logs.png`,
    tags: ['Multi-Service Stream', 'Color-Coded Badges', 'Regex Search', 'Clickable Links']
  }
];

export default function ContainerStudioPage(): ReactNode {
  const [activeTourId, setActiveTourId] = useState<string>('containers-list');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const detectedOS = useSyncExternalStore(subscribeOS, getClientOSSnapshot, getServerOSSnapshot);
  const [userSelectedOS, setUserSelectedOS] = useState<PlatformKey | null>(null);
  const selectedOS = userSelectedOS ?? detectedOS;
  const [otherFormatsOpen, setOtherFormatsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const subNavRef = useRef<HTMLDivElement>(null);
  const isFirstTourRender = useRef<boolean>(true);
  const [releaseInfo, setReleaseInfo] = useState<{
    version: string;
    publishedDate?: string;
    releaseUrl?: string;
    loading: boolean;
  }>({
    version: ContainerStudioConfig.DEFAULT_VERSION,
    releaseUrl: ContainerStudioConfig.LATEST_RELEASE_URL,
    loading: true
  });

  const activeTourScreen = studioScreens.find(s => s.id === activeTourId) ?? studioScreens[0];
  const activeTourModuleKey = activeTourScreen.category;
  const currentModuleScreens = studioScreens.filter(s => s.category === activeTourModuleKey);

  const primaryDownload = ContainerStudioConfig.getPrimaryDownload(selectedOS, releaseInfo.version);
  const allDownloads = ContainerStudioConfig.getAllDownloads(releaseInfo.version);

  const goToPrevTourScreen = useCallback(() => {
    setActiveTourId(prevId => {
      const idx = studioScreens.findIndex(s => s.id === prevId);
      const safeIdx = idx !== -1 ? idx : 0;
      const prevIdx = (safeIdx - 1 + studioScreens.length) % studioScreens.length;
      return studioScreens[prevIdx].id;
    });
  }, []);

  const goToNextTourScreen = useCallback(() => {
    setActiveTourId(prevId => {
      const idx = studioScreens.findIndex(s => s.id === prevId);
      const safeIdx = idx !== -1 ? idx : 0;
      const nextIdx = (safeIdx + 1) % studioScreens.length;
      return studioScreens[nextIdx].id;
    });
  }, []);

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
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOtherFormatsOpen(false);
      }
    };

    if (otherFormatsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [otherFormatsOpen]);

  useEffect(() => {
    fetch('https://api.hprasath.com/v1/integrations/github/catbee-container-studio/releases')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch release');
        return res.json();
      })
      .then(({ data }) => {
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
            releaseUrl: data.html_url || ContainerStudioConfig.LATEST_RELEASE_URL,
            loading: false
          });
        }
      })
      .catch(() => {
        setReleaseInfo(prev => ({ ...prev, loading: false }));
      });
  }, []);

  useEffect(() => {
    studioScreens.forEach(scr => {
      const img = new Image();
      img.src = scr.image;
    });
  }, []);

  useEffect(() => {
    if (isFirstTourRender.current) {
      isFirstTourRender.current = false;
      return;
    }
    const container = subNavRef.current;
    if (container) {
      const activeBtn = container.querySelector<HTMLElement>(`.${styles.subScreenChipActive}`);
      if (activeBtn) {
        const containerLeft = container.scrollLeft;
        const containerWidth = container.clientWidth;
        const btnLeft = activeBtn.offsetLeft;
        const btnWidth = activeBtn.offsetWidth;

        if (btnLeft < containerLeft) {
          container.scrollTo({ left: Math.max(0, btnLeft - 12), behavior: 'smooth' });
        } else if (btnLeft + btnWidth > containerLeft + containerWidth) {
          container.scrollTo({
            left: btnLeft + btnWidth - containerWidth + 12,
            behavior: 'smooth'
          });
        }
      }
    }
  }, [activeTourId]);

  const openLightbox = useCallback((id: string) => {
    const idx = studioScreens.findIndex(s => s.id === id);
    if (idx !== -1) {
      setLightboxIndex(idx);
    }
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(curr => {
      if (curr !== null && studioScreens[curr]) {
        setActiveTourId(studioScreens[curr].id);
      }
      return null;
    });
  }, []);

  const nextLightboxImage = useCallback(() => {
    setLightboxIndex(prev => (prev === null ? null : (prev + 1) % studioScreens.length));
  }, []);

  const prevLightboxImage = useCallback(() => {
    setLightboxIndex(prev => (prev === null ? null : (prev - 1 + studioScreens.length) % studioScreens.length));
  }, []);

  const lightboxTouchStartXRef = useRef<number | null>(null);
  const lightboxTouchStartYRef = useRef<number | null>(null);

  const handleLightboxTouchStart = useCallback((e: React.TouchEvent) => {
    lightboxTouchStartXRef.current = e.touches[0].clientX;
    lightboxTouchStartYRef.current = e.touches[0].clientY;
  }, []);

  const handleLightboxTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (lightboxTouchStartXRef.current === null || lightboxTouchStartYRef.current === null) return;
      const deltaX = e.changedTouches[0].clientX - lightboxTouchStartXRef.current;
      const deltaY = e.changedTouches[0].clientY - lightboxTouchStartYRef.current;

      if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
        if (deltaX < 0) {
          nextLightboxImage();
        } else {
          prevLightboxImage();
        }
      }
      lightboxTouchStartXRef.current = null;
      lightboxTouchStartYRef.current = null;
    },
    [nextLightboxImage, prevLightboxImage]
  );

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
                <div className={styles.downloadButtonGroup} ref={dropdownRef}>
                  <Link
                    className={styles.primaryButton}
                    href={primaryDownload.url}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <CatbeeIcon name={primaryDownload.icon} size='small' />
                    <span className={styles.btnTextWrap}>
                      <span>{primaryDownload.label}</span>
                      <small className={styles.btnSubtext}>{primaryDownload.ext}</small>
                    </span>
                    <span className={styles.btnArrow}>↓</span>
                  </Link>

                  <button
                    type='button'
                    className={styles.dropdownToggleBtn}
                    onClick={() => setOtherFormatsOpen(prev => !prev)}
                    aria-label='Show all download formats and platforms'
                    aria-expanded={otherFormatsOpen}
                    title='Other formats & platforms'
                  >
                    <CatbeeIcon
                      name='expand_more'
                      size='small'
                      className={clsx(styles.dropdownChevron, otherFormatsOpen && styles.rotated)}
                    />
                  </button>

                  {otherFormatsOpen && (
                    <div className={styles.downloadDropdownMenu}>
                      <div className={styles.dropdownHeader}>
                        <span>Version {releaseInfo.version}</span>
                        <Link
                          href={releaseInfo.releaseUrl ?? ContainerStudioConfig.LATEST_RELEASE_URL}
                          target='_blank'
                          rel='noopener noreferrer'
                          className={styles.releaseNotesLink}
                        >
                          Release notes ↗
                        </Link>
                      </div>

                      <div className={styles.dropdownGrid}>
                        {/* Windows */}
                        <div className={styles.dropdownSection}>
                          <div className={styles.dropdownSectionTitle}>
                            <CatbeeIcon name='devicon-windows11-original' size='small' />
                            <span>Windows</span>
                          </div>
                          {allDownloads.windows.map(item => (
                            <Link
                              key={item.id}
                              href={item.url}
                              className={styles.dropdownItem}
                              onClick={() => setOtherFormatsOpen(false)}
                            >
                              <span>{item.label}</span>
                              <span className={styles.itemExt}>{item.ext}</span>
                            </Link>
                          ))}
                          <Link
                            href={ContainerStudioConfig.MICROSOFT_STORE_URL}
                            target='_blank'
                            rel='noopener noreferrer'
                            className={styles.dropdownItem}
                            onClick={() => setOtherFormatsOpen(false)}
                          >
                            <span>Microsoft Store</span>
                            <span className={styles.itemExt}>Store ↗</span>
                          </Link>
                        </div>

                        {/* macOS */}
                        <div className={styles.dropdownSection}>
                          <div className={styles.dropdownSectionTitle}>
                            <CatbeeIcon name='devicon-apple-original' size='small' />
                            <span>macOS</span>
                          </div>
                          {allDownloads.mac.map(item => (
                            <Link
                              key={item.id}
                              href={item.url}
                              className={styles.dropdownItem}
                              onClick={() => setOtherFormatsOpen(false)}
                            >
                              <span>{item.label}</span>
                              <span className={styles.itemExt}>{item.ext}</span>
                            </Link>
                          ))}
                        </div>

                        {/* Linux */}
                        <div className={styles.dropdownSection}>
                          <div className={styles.dropdownSectionTitle}>
                            <CatbeeIcon name='devicon-linux-plain' size='small' />
                            <span>Linux</span>
                          </div>
                          {allDownloads.linux.map(item => (
                            <Link
                              key={item.id}
                              href={item.url}
                              className={styles.dropdownItem}
                              onClick={() => setOtherFormatsOpen(false)}
                            >
                              <span>{item.label}</span>
                              <span className={styles.itemExt}>{item.ext}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {selectedOS === 'windows' && (
                  <MicrosoftButton
                    productId={ContainerStudioConfig.MICROSOFT_STORE_PRODUCT_ID}
                    className={styles.fullWidthBtn}
                  />
                )}

                {selectedOS === 'mac' && (
                  <Link
                    className={styles.outlineButton}
                    href={ContainerStudioConfig.getDownload('mac-zip', releaseInfo.version).url}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <CatbeeIcon name='folder_zip' size='small' />
                    <span>Universal Archive (.zip)</span>
                  </Link>
                )}

                {selectedOS === 'linux' && (
                  <Link
                    className={styles.outlineButton}
                    href={ContainerStudioConfig.getDownload('linux-appimage', releaseInfo.version).url}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <CatbeeIcon name='extension' size='small' />
                    <span>Universal AppImage</span>
                  </Link>
                )}
              </div>

              <div className={styles.platforms}>
                <span className={styles.platformsLabel}>Platforms:</span>
                <button
                  type='button'
                  className={clsx(styles.platformTab, selectedOS === 'windows' && styles.activeTab)}
                  onClick={() => setUserSelectedOS('windows')}
                >
                  <CatbeeIcon name='devicon-windows11-original' size='small' />
                  <span>Windows</span>
                  {detectedOS === 'windows' && <span className={styles.detectedDot} title='Detected OS' />}
                </button>
                <i />
                <button
                  type='button'
                  className={clsx(styles.platformTab, selectedOS === 'mac' && styles.activeTab)}
                  onClick={() => setUserSelectedOS('mac')}
                >
                  <CatbeeIcon name='devicon-apple-original' size='small' />
                  <span>macOS</span>
                  {detectedOS === 'mac' && <span className={styles.detectedDot} title='Detected OS' />}
                </button>
                <i />
                <button
                  type='button'
                  className={clsx(styles.platformTab, selectedOS === 'linux' && styles.activeTab)}
                  onClick={() => setUserSelectedOS('linux')}
                >
                  <CatbeeIcon name='devicon-linux-plain' size='small' />
                  <span>Linux</span>
                  {detectedOS === 'linux' && <span className={styles.detectedDot} title='Detected OS' />}
                </button>
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
                <Heading as='h4'>Zero-Command Lifecycle</Heading>
                <p>
                  Start, stop, restart, force recreate, inspect, and configure containers with single-click precision.
                </p>
              </div>
            </div>

            <div className={styles.tickerCard}>
              <div className={styles.tickerIcon}>
                <CatbeeIcon name='folder' size='medium' />
              </div>
              <div className={styles.tickerText}>
                <Heading as='h4'>Direct Files & Monaco Editor</Heading>
                <p>Explore, inspect, and edit files inside running containers and volumes with Monaco Editor.</p>
              </div>
            </div>

            <div className={styles.tickerCard}>
              <div className={styles.tickerIcon}>
                <CatbeeIcon name='show_chart' size='medium' />
              </div>
              <div className={styles.tickerText}>
                <Heading as='h4'>Live Telemetry & Group Metrics</Heading>
                <p>Stream real-time CPU %, memory consumption, network throughput, and Compose stack metrics.</p>
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
              <div className={styles.tourSubNav} ref={subNavRef}>
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
                      <span>{scr.badge ?? scr.title.split('&')[0].trim()}</span>
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
                      <AnimatePresence mode='popLayout'>
                        <motion.img
                          key={activeTourScreen.id}
                          src={activeTourScreen.image}
                          alt={activeTourScreen.title}
                          className={styles.tourImage}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.18, ease: 'easeInOut' }}
                          loading='eager'
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

                  <div className={styles.tourHighlightsPills}>
                    {activeTourScreen.highlights.slice(0, 3).map((h, i) => (
                      <div key={i} className={styles.tourHighlightPill} title={h}>
                        <CatbeeIcon name='check_circle' size='small' />
                        <span>{h}</span>
                      </div>
                    ))}
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
                  High-performance desktop shell powered by Angular Signals, Signal Forms, and control flow paired with
                  Electron. Low idle memory, instantaneous view switching, and integrated Monaco Editor.
                </p>
              </div>

              <div className={styles.specCard}>
                <div className={styles.specIcon}>
                  <CatbeeIcon name='devicon-docker-plain' size='large' />
                </div>
                <Heading as='h3'>Direct Engine Socket</Heading>
                <p>
                  Communicates directly through local Docker daemon sockets (`/var/run/docker.sock` on Linux/macOS or
                  `\\.\pipe\docker_engine` on Windows) via Dockerode. No intermediaries.
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
                  Available for Windows (.exe, portable .zip, Microsoft Store), macOS (Universal .dmg, .zip), and Linux
                  (.AppImage, .deb, .rpm, .tar.gz). Works with Docker Desktop, Rancher, Colima, or Podman.
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
                    href={releaseInfo.releaseUrl ?? ContainerStudioConfig.LATEST_RELEASE_URL}
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
                  <strong>Electron • Angular • Monaco Editor • Dockerode</strong>
                </li>
              </ul>

              <div className={styles.platformDownloadsGrid}>
                <div className={styles.platformDownloadsTitle}>
                  <CatbeeIcon name='download' size='small' />
                  <span>Direct Downloads ({releaseInfo.version})</span>
                </div>

                <div className={styles.platformDownloadRow}>
                  <span className={styles.platformName}>
                    <CatbeeIcon name='devicon-windows11-original' size='small' />
                    Windows
                  </span>
                  <div className={styles.platformFormats}>
                    {allDownloads.windows.map(item => (
                      <Link key={item.id} href={item.url} className={styles.formatPill}>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className={styles.platformDownloadRow}>
                  <span className={styles.platformName}>
                    <CatbeeIcon name='devicon-apple-original' size='small' />
                    macOS
                  </span>
                  <div className={styles.platformFormats}>
                    {allDownloads.mac.map(item => (
                      <Link key={item.id} href={item.url} className={styles.formatPill}>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className={styles.platformDownloadRow}>
                  <span className={styles.platformName}>
                    <CatbeeIcon name='devicon-linux-plain' size='small' />
                    Linux
                  </span>
                  <div className={styles.platformFormats}>
                    {allDownloads.linux.map(item => (
                      <Link key={item.id} href={item.url} className={styles.formatPill}>
                        {item.ext}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
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
                    <div className={styles.lightboxShortcutInfo}>
                      <span className={styles.shortcutKeyGroup}>
                        <kbd>←</kbd>
                        <kbd>→</kbd>
                        <span>Navigate</span>
                      </span>
                      <span className={styles.shortcutDivider}>•</span>
                      <span className={styles.shortcutKeyGroup}>
                        <kbd>Esc</kbd>
                        <span>Close</span>
                      </span>
                    </div>

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
                <div
                  className={styles.lightboxMediaStage}
                  onTouchStart={handleLightboxTouchStart}
                  onTouchEnd={handleLightboxTouchEnd}
                >
                  <button
                    type='button'
                    className={clsx(styles.lightboxNavBtn, styles.lightboxPrevBtn)}
                    onClick={e => {
                      e.stopPropagation();
                      prevLightboxImage();
                    }}
                    title='Previous image (Left arrow)'
                    aria-label='Previous image'
                  >
                    <CatbeeIcon name='chevron_left' size='large' />
                  </button>

                  <div className={styles.lightboxImageContainer}>
                    <img
                      src={studioScreens[lightboxIndex].image}
                      alt={studioScreens[lightboxIndex].title}
                      className={styles.lightboxImage}
                      loading='eager'
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
                    aria-label='Next image'
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
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </Layout>
  );
}
