import React, { type ReactNode } from 'react';
import { useLocation } from '@docusaurus/router';
import { useThemeConfig } from '@docusaurus/theme-common';
import { useNavbarMobileSidebar } from '@docusaurus/theme-common/internal';
import NavbarItem, { type Props as NavbarItemConfig } from '@theme/NavbarItem';
import { getContextualNavbarItems } from '@site/src/utils/containerStudioNav';

export default function NavbarMobilePrimaryMenu(): ReactNode {
  const mobileSidebar = useNavbarMobileSidebar();
  const { pathname } = useLocation();
  const rawItems = useThemeConfig().navbar.items as NavbarItemConfig[];
  const items = getContextualNavbarItems(rawItems, pathname);

  return (
    <ul className='menu__list'>
      {items.map((item, i) => (
        <NavbarItem mobile {...item} onClick={() => mobileSidebar.toggle()} key={i} />
      ))}
    </ul>
  );
}
