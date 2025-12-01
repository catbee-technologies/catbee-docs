import React from 'react';
import DocItem from '@theme-original/DocItem';
import VersionBadge from '@site/src/components/VersionBadge';
import packageConfig from '@site/versions.config';

export default function DocItemWrapper(props: React.ComponentProps<typeof DocItem>) {
  const content = props.content;
  const source = content?.metadata?.source || '';

  const patterns = Object.entries(packageConfig).flatMap(([pkg, current]) => [
    {
      match: new RegExp(`${pkg}/`),
      label: () => `current (v${current})`
    },
    {
      match: new RegExp(`${pkg}@([\\w.-]+)`),
      label: (v: string) => `v${v}`
    }
  ]);

  let version: string | null = null;

  for (const { match, label } of patterns) {
    const m = source.match(match);
    if (m) {
      version = label(m[1]);
      break;
    }
  }

  return (
    <>
      {version && <VersionBadge version={version} />}
      <DocItem {...props} />
    </>
  );
}
