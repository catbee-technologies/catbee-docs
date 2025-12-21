import type { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './index.module.scss';

export interface IconProps {
  /**
   * Icon name (material icon name or devicon class)
   */
  name: string;
  /**
   * Icon provider
   * @default 'material'
   */
  /**
   * Icon size
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  /**
   * Custom class name
   */
  className?: string;
  /**
   *  Custom styles
   */
  style?: React.CSSProperties;
  /**
   * Custom color
   */
  color?: string;
}

/**
 * Unified icon component supporting Material Icons and Devicons
 *
 * @example
 * ```tsx
 * // Material Icon
 * <CatbeeIcon name="check_circle" size="large" />
 *
 * // Devicon
 * <CatbeeIcon name="devicon-typescript-plain" type="devicon" size="xlarge" />
 * ```
 */
export default function CatbeeIcon({ name, size = 'medium', className, color, style }: Readonly<IconProps>): ReactNode {
  const provider = name.startsWith('devicon-') ? 'devicon' : 'material';

  if (provider === 'material') {
    return (
      <span className={clsx('material-icons', styles.icon, styles[size], className)} style={{ color, ...style }}>
        {name}
      </span>
    );
  }
  return <i className={clsx(name, styles.icon, styles[size], className)} style={{ color, ...style }} />;
}
