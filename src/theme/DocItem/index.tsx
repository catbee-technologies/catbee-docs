import React from 'react';
import DocItem from '@theme-original/DocItem';
import VersionBadge from '@site/src/components/VersionBadge';

export default function DocItemWrapper(props: React.ComponentProps<typeof DocItem>) {
  const content = props.content;
  const source = content?.metadata?.source || '';

  const patterns = [
    { match: /monaco-editor@([\w.-]+)/, label: (v: string) => `v${v}` },
    { match: /monaco-editor\//, label: () => 'current (v21)' },
    { match: /@catbee\/utils@([\w.-]+)/, label: (v: string) => `v${v}` },
    { match: /@catbee\/utils\//, label: () => 'current (v1.x.x)' }
  ];

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
