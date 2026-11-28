import React, { type ReactNode } from 'react';
import { useLocation } from '@docusaurus/router';
import OriginalDocSidebarNavbarItem from '@theme-original/NavbarItem/DocSidebarNavbarItem';
import type DocSidebarNavbarItemType from '@theme/NavbarItem/DocSidebarNavbarItem';
import type { WrapperProps } from '@docusaurus/types';
import { isContainerStudioPath } from '@site/src/utils/containerStudioNav';

type Props = WrapperProps<typeof DocSidebarNavbarItemType>;

export default function DocSidebarNavbarItemWrapper({ sidebarId, docsPluginId, ...props }: Props): ReactNode {
  const { pathname } = useLocation();
  const isContainerStudioDocsLink = isContainerStudioPath(pathname) && sidebarId === 'docsSidebar';

  return (
    <OriginalDocSidebarNavbarItem
      {...props}
      sidebarId={isContainerStudioDocsLink ? 'containerStudioSidebar' : sidebarId}
      docsPluginId={isContainerStudioDocsLink ? 'container-studio' : docsPluginId}
    />
  );
}
