import { globby } from 'globby';
import prettier from 'prettier';
import { getAllPosts } from '../lib/api';
import { writeFileSync } from 'fs';
import path from 'path';

async function generate() {
  const prettierConfig = await prettier.resolveConfig('./.prettierrc.js');
  const pages = await globby([
    'app/**/*.tsx',
    'app/**/*.ts',
    '!app/**/_*.tsx',
    '!app/**/_*.ts',
    '!app/**/layout.tsx',
    '!app/**/error.tsx',
    '!app/**/loading.tsx',
    '!app/**/not-found.tsx',
    '!app/api/**/*',
  ]);

  const posts = getAllPosts();

  const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages
        .map((page) => {
          const pagePath = page
            .replace('app', '')
            .replace('/page.tsx', '')
            .replace('/page.ts', '')
            .replace('.tsx', '')
            .replace('.ts', '');
          const route = pagePath === '/index' ? '' : pagePath;
          return `
            <url>
              <loc>${`https://humanize-ai.top${route}`}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>daily</changefreq>
              <priority>0.7</priority>
            </url>
          `;
        })
        .join('')}
      ${posts
        .map((post) => {
          return `
            <url>
              <loc>${`https://humanize-ai.top/blog/${post.slug}`}</loc>
              <lastmod>${new Date(post.date).toISOString()}</lastmod>
              <changefreq>weekly</changefreq>
              <priority>0.5</priority>
            </url>
          `;
        })
        .join('')}
    </urlset>
  `;

  const formatted = await prettier.format(sitemap, {
    ...prettierConfig,
    parser: 'html',
  });

  writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), formatted);
  console.log('Sitemap generated successfully');
}

generate().catch((error) => {
  console.error('Error generating sitemap:', error);
  process.exit(1);
});