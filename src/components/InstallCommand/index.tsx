import { useState } from 'react';
import type { ReactNode } from 'react';
import clsx from 'clsx';
import CatbeeIcon from '@site/src/components/Icon';
import styles from './index.module.scss';

export interface InstallCommandProps {
  command?: string;
  className?: string;
}

export default function InstallCommand({
  command = 'npm install @ng-catbee/cookie',
  className
}: Readonly<InstallCommandProps>): ReactNode {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={clsx(styles.installCommand, className)}>
      <div className={styles.commandWrapper}>
        <span className={styles.commandPrompt}>$</span>
        <code className={styles.commandText}>{command}</code>
        <button
          className={clsx(styles.copyButton, copied && styles.copied)}
          onClick={handleCopy}
          aria-label='Copy installation command'
        >
          {copied ? <CatbeeIcon name='check' /> : <CatbeeIcon name='content_copy' />}
        </button>
      </div>
    </div>
  );
}
