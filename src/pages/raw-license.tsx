import React, { useEffect } from 'react';
import License from '@site/LICENSE.md';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';

export default function RawLicense() {
  const year = new Date().getFullYear();

  useEffect(() => {
    const root = document.getElementById('rawLicense');
    if (!root) return;

    const headings = root.getElementsByTagName('h1');
    if (headings.length > 1) {
      for (const h of Array.from(headings)) {
        if (h.dataset.custom === 'true') {
          delete h.dataset.custom;
          continue;
        }
        if (h.textContent?.trim() === 'The MIT License') {
          h.remove();
          break;
        }
      }
    }

    const paragraphs = Array.from(root.getElementsByTagName('p'));
    for (const p of paragraphs) {
      if (p.dataset.custom === 'true') {
        delete p.dataset.custom;
        continue;
      }
      if (p.textContent?.includes('Copyright')) {
        p.remove();
        break;
      }
    }
  }, []);

  return (
    <div id='rawLicense'>
      <Heading as='h1' data-custom='true'>
        The MIT License
      </Heading>

      <p data-custom='true'>
        Copyright &copy; {year} Catbee Technologies.{' '}
        <Link to='https://catbee.in/license'>https://catbee.in/license</Link>
      </p>

      <License />
    </div>
  );
}
