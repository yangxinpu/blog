import { writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join, extname, basename, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const docsDir = join(__dirname, '../docs');
const outputDir = join(__dirname, '../public');

interface PageEntry {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

function collectPages(dir: string, basePath: string, pages: PageEntry[]): void {
  const dirContent = readdirSync(dir);
  
  dirContent.forEach(item => {
    const fullPath = join(dir, item);
    const stats = statSync(fullPath);
    const lastmod = new Date(stats.mtime).toISOString().split('T')[0];
    
    if (stats.isDirectory()) {
      const indexPath = join(fullPath, 'index.md');
      if (existsSync(indexPath)) {
        pages.push({
          loc: `https://nailuo.com${basePath}/${item}/`,
          lastmod,
          changefreq: 'weekly',
          priority: '0.8',
        });
      }
      collectPages(fullPath, `${basePath}/${item}`, pages);
    } else if (extname(item) === '.md') {
      const fileName = basename(item, '.md');
      if (fileName !== 'index') {
        pages.push({
          loc: `https://nailuo.com${basePath}/${fileName}`,
          lastmod,
          changefreq: 'monthly',
          priority: '0.6',
        });
      }
    }
  });
}

function generateSitemapXml(pages: PageEntry[], language: string): string {
  const pagesXml = pages.map(page => `
    <url>
      <loc>${page.loc}</loc>
      <lastmod>${page.lastmod}</lastmod>
      <changefreq>${page.changefreq}</changefreq>
      <priority>${page.priority}</priority>
      ${language === 'zh' 
        ? '<xhtml:link rel="alternate" hreflang="en" href="' + page.loc.replace('/zh/', '/en/') + '"/>' 
        : '<xhtml:link rel="alternate" hreflang="zh" href="' + page.loc.replace('/en/', '/zh/') + '"/>'}
    </url>
  `).join('\n');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${pagesXml}
</urlset>`;
}

function main(): void {
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }
  
  const zhPages: PageEntry[] = [];
  const enPages: PageEntry[] = [];
  
  zhPages.push({
    loc: 'https://nailuo.com/zh/',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: '1.0',
  });
  
  enPages.push({
    loc: 'https://nailuo.com/en/',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: '1.0',
  });
  
  collectPages(join(docsDir, 'zh'), '/zh', zhPages);
  collectPages(join(docsDir, 'en'), '/en', enPages);
  
  const zhSitemap = generateSitemapXml(zhPages, 'zh');
  const enSitemap = generateSitemapXml(enPages, 'en');
  
  const zhOutputDir = join(outputDir, 'zh');
  const enOutputDir = join(outputDir, 'en');
  
  if (!existsSync(zhOutputDir)) mkdirSync(zhOutputDir, { recursive: true });
  if (!existsSync(enOutputDir)) mkdirSync(enOutputDir, { recursive: true });
  
  writeFileSync(join(zhOutputDir, 'sitemap.xml'), zhSitemap, { encoding: 'utf-8' });
  writeFileSync(join(enOutputDir, 'sitemap.xml'), enSitemap, { encoding: 'utf-8' });
  
  const indexSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://nailuo.com/zh/sitemap.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://nailuo.com/en/sitemap.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
</sitemapindex>`;
  
  writeFileSync(join(outputDir, 'sitemap.xml'), indexSitemap, { encoding: 'utf-8' });
  
  console.log('Sitemap generated successfully!');
}

main();
