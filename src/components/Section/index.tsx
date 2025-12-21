import clsx from 'clsx';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Heading from '@theme/Heading';
import CatbeeIcon from '@site/src/components/Icon';
import styles from './index.module.scss';

export interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  description?: string;
  icon?: string;
  motionProps?: Record<string, unknown>;
  motionClassName?: string;
}

export default function CatbeeSection({
  id,
  children,
  className,
  style,
  title,
  icon,
  description = '',
  motionProps = {}
}: Readonly<SectionProps>): ReactNode {
  return (
    <section id={id} className={clsx(styles.catbeeSection, className)} style={style}>
      <div className='container'>
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={styles.catbeeSectionHeader}
            {...motionProps}
          >
            <Heading as='h2' className={styles.catbeeSectionTitle}>
              {icon && <CatbeeIcon name={icon} className={styles.catbeeSectionTitleIcon} />} {title}
            </Heading>
            {description && <p className={styles.catbeeSectionDescription}>{description}</p>}
          </motion.div>
        )}
        {children}
      </div>
    </section>
  );
}
