import { useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import styles from './PackageManagerTabs.module.scss';

type PackageManager = 'npm' | 'yarn' | 'pnpm';

interface PackageManagerTabsProps {
  packageName?: string;
}

export default function PackageManagerTabs({ packageName = '@ng-catbee/cookie' }: PackageManagerTabsProps) {
  const [activeTab, setActiveTab] = useState<PackageManager>('npm');
  const [copied, setCopied] = useState(false);

  const commands: Record<PackageManager, string> = {
    npm: `npm install ${packageName}`,
    yarn: `yarn add ${packageName}`,
    pnpm: `pnpm add ${packageName}`
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(commands[activeTab]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={styles.packageManagerTabs}>
      <div className={styles.tabButtons}>
        {(['npm', 'yarn', 'pnpm'] as PackageManager[]).map(tab => (
          <button
            key={tab}
            className={clsx(styles.tabButton, activeTab === tab && styles.active)}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                className={styles.activeIndicator}
                layoutId='activeTab'
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={styles.commandDisplay}
      >
        <div className={styles.commandWrapper}>
          <span className={styles.prompt}>$</span>
          <code className={styles.command}>{commands[activeTab]}</code>
          <button
            className={clsx(styles.copyButton, copied && styles.copied)}
            onClick={handleCopy}
            aria-label='Copy command'
          >
            {copied ? (
              <span className='material-icons'>check</span>
            ) : (
              <span className='material-icons'>content_copy</span>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
