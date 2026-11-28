import React, { type ReactNode } from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useLocation } from '@docusaurus/router';
import { translate } from '@docusaurus/Translate';
import OriginalHomeBreadcrumbItem from '@theme-original/DocBreadcrumbs/Items/Home';
import IconHome from '@theme/Icon/Home';
import { isContainerStudioDocsPath } from '@site/src/utils/containerStudioNav';
import styles from './styles.module.css';

export default function HomeBreadcrumbItem(): ReactNode {
  const { pathname } = useLocation();
  const containerStudioHomeHref = useBaseUrl('/catbee-container-studio/');

  if (!isContainerStudioDocsPath(pathname)) {
    return <OriginalHomeBreadcrumbItem />;
  }

  return (
    <li className='breadcrumbs__item'>
      <Link
        aria-label={translate({
          id: 'theme.docs.breadcrumbs.home',
          message: 'Home page',
          description: 'The ARIA label for the home page in the breadcrumbs'
        })}
        className='breadcrumbs__link'
        to={containerStudioHomeHref}
      >
        <IconHome className={styles.breadcrumbHomeIcon} />
      </Link>
    </li>
  );
}
