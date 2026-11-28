import type { Props as NavbarItemConfig } from '@theme/NavbarItem';
import { ContainerStudioConfig } from '@site/src/pages/catbee-container-studio/config';

const HIDDEN_IN_CONTAINER_STUDIO = new Set([
  'navbar-packages-dropdown',
  'navbar-tools-dropdown',
  'navbar-products-dropdown',
  'navbar-license-link',
  'navbar-npm-dropdown'
]);

/** Matches the Container Studio product landing page or any of its docs routes. */
export function isContainerStudioPath(pathname: string): boolean {
  return pathname === '/catbee-container-studio' || pathname.startsWith('/catbee-container-studio/');
}

/** Matches any route under Container Studio documentation. */
export function isContainerStudioDocsPath(pathname: string): boolean {
  return pathname === '/catbee-container-studio/docs' || pathname.startsWith('/catbee-container-studio/docs/');
}

/** Filters and adapts navbar items when viewing Container Studio pages. */
export function getContextualNavbarItems(items: NavbarItemConfig[], pathname: string): NavbarItemConfig[] {
  if (!isContainerStudioPath(pathname)) {
    return items;
  }

  return items.reduce<NavbarItemConfig[]>((acc, item) => {
    const itemClass = 'className' in item ? item.className : undefined;
    if (itemClass && HIDDEN_IN_CONTAINER_STUDIO.has(itemClass)) {
      return acc;
    }

    if (itemClass === 'navbar-github-dropdown') {
      acc.push({
        type: 'default',
        href: ContainerStudioConfig.GITHUB_URL,
        label: 'GitHub',
        position: 'position' in item ? item.position : 'right',
        className: 'navbar-github-dropdown'
      });
      return acc;
    }

    acc.push(item);
    return acc;
  }, []);
}
