import { useState } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import InstallCommand from '@site/src/components/InstallCommand';
import styles from './index.module.scss';

type PackageManager = 'npm' | 'yarn' | 'pnpm';

interface PackageManagerTabsProps {
  packageName?: string;
}

export default function PackageManagerTabs({
  packageName = '@ng-catbee/cookie'
}: Readonly<PackageManagerTabsProps>): ReactNode {
  const [activeTab, setActiveTab] = useState<PackageManager>('npm');

  const commands: Record<PackageManager, string> = {
    npm: `npm install ${packageName}`,
    yarn: `yarn add ${packageName}`,
    pnpm: `pnpm add ${packageName}`
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
        <InstallCommand command={commands[activeTab]} className={styles.installCommand} />
      </motion.div>
    </div>
  );
}
