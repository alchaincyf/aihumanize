//ts-nocheck

'use client';

import React, { useEffect, useState } from 'react';
import styles from './BlogPost.module.css';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

const TableOfContents: React.FC<{ content: string }> = ({ content }) => {
  const [toc, setToc] = useState<TOCItem[]>([]);

  useEffect(() => {
    const headings = content.match(/^#{2,3} .+$/gm) || [];
    const tocItems = headings.map(heading => {
      const match = heading.match(/^(#+)\s(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2];
        const id = text.toLowerCase().replace(/\s/g, '-');
        return { id, text, level };
      }
      return null;
    }).filter((item): item is TOCItem => item !== null);
    setToc(tocItems);
  }, [content]);

  return (
    <nav className={styles.tableOfContents}>
      <h2 className={styles.tocTitle}>Contents</h2>
      <ul className={styles.tocList}>
        {toc.map((item, index) => (
          <li key={index} className={styles[`tocLevel${item.level}`]}>
            <a href={`#${item.id}`}>{item.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;