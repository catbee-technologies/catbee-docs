import type { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './index.module.scss';
import CatbeeIcon, { IconProps } from '@site/src/components/Icon';

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  target?: string;
  className?: string;
  variant?: 'primary' | 'secondary';
  icon?: string;
  iconPosition?: 'left' | 'right';
  iconSize?: IconProps['size'];
  iconClassName?: string;
  onClick?: () => void;
}

export default function Button({
  children,
  href,
  target,
  className,
  variant = 'primary',
  icon,
  iconPosition = 'left',
  iconSize = 'medium',
  iconClassName,
  onClick
}: Readonly<ButtonProps>): ReactNode {
  const Element = href ? 'a' : 'button';
  return (
    <Element
      href={href}
      target={target}
      className={clsx(
        'button button--lg',
        styles.catbeeButton,
        variant === 'primary' ? styles.primary : styles.secondary,
        className
      )}
      onClick={onClick}
    >
      {icon && iconPosition === 'left' && <CatbeeIcon name={icon} size={iconSize} className={iconClassName} />}
      {children}
      {icon && iconPosition === 'right' && <CatbeeIcon name={icon} size={iconSize} className={iconClassName} />}
    </Element>
  );
}
