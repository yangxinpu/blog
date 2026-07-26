import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join, extname, basename, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const docsDir = join(__dirname, '../docs');
const outputDir = join(__dirname, '../public');

interface FeedItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  category: string;
}

function parseMarkdownTitle(fileContent: string): string {
  const match = fileContent.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : 'Untitled';
}

function parseMarkdownDescription(fileContent: string): string {
  const lines = fileContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  const firstContentLine = lines.find(line => line.trim());
  return firstContentLine ? firstContentLine.trim().substring(0, 200) : '';
}

function collectDocs(dir: string, basePath: string, items: FeedItem[], category: string): void {
  const dirContent = readdirSync(dir);
  
  dirContent.forEach(item => {
    const fullPath = join(dir, item);
    const stats = statSync(fullPath);
    const lastmod = new Date(stats.mtime).toISOString();
    
    if (stats.isDirectory()) {
      const newCategory = category ? `${category} > ${item}` : item;
      collectDocs(fullPath, `${basePath}/${item}`, items, newCategory);
    } else if (extname(item) === '.md' && item !== 'index.md') {
      const content = readFileSync(fullPath, { encoding: 'utf-8' });
      const title = parseMarkdownTitle(content);
      const description = parseMarkdownDescription(content);
      
      const fileName = basename(item, '.md');
      const link = `${basePath}/${fileName}`;
      
      items.push({
        title,
        link: `https://nailuo.com${link}`,
        description,
        pubDate: lastmod,
        category: category || '技术',
      });
    }
  });
}

function generateRssXml(items: FeedItem[], language: string): string {
  const now = new Date().toISOString();
  const title = language === 'zh' ? 'NaiLuo 知识库' : 'NaiLuo Knowledge Base';
  const description = language === 'zh' 
    ? '前端技术知识库 - JavaScript、React、Vue、Node.js、性能优化等技术学习笔记' 
    : 'Frontend Tech Knowledge Base - JavaScript, React, Vue, Node.js, Performance Optimization';
  const baseUrl = `https://nailuo.com/${language}/`;
  
  const itemsXml = items.map(item => `
    <item>
      <title>${item.title}</title>
      <link>${item.link}</link>
      <description><![CDATA[${item.description}]]></description>
      <pubDate>${new Date(item.pubDate).toUTCString()}</pubDate>
      <category>${item.category}</category>
      <guid isPermaLink="true">${item.link}</guid>
    </item>
  `).join('\n');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${title}</title>
    <link>${baseUrl}</link>
    <description>${description}</description>
    <language>${language === 'zh' ? 'zh-CN' : 'en-US'}</language>
    <pubDate>${new Date(now).toUTCString()}</pubDate>
    <lastBuildDate>${new Date(now).toUTCString()}</lastBuildDate>
    <atom:link href="https://nailuo.com/${language}/rss.xml" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`;
}

function main(): void {
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }
  
  const zhItems: FeedItem[] = [];
  const enItems: FeedItem[] = [];
  
  collectDocs(join(docsDir, 'zh'), '/zh', zhItems, '');
  collectDocs(join(docsDir, 'en'), '/en', enItems, '');
  
  zhItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
  enItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
  
  const zhRss = generateRssXml(zhItems, 'zh');
  const enRss = generateRssXml(enItems, 'en');
  
  const zhOutputDir = join(outputDir, 'zh');
  const enOutputDir = join(outputDir, 'en');
  
  if (!existsSync(zhOutputDir)) mkdirSync(zhOutputDir, { recursive: true });
  if (!existsSync(enOutputDir)) mkdirSync(enOutputDir, { recursive: true });
  
  writeFileSync(join(zhOutputDir, 'rss.xml'), zhRss, { encoding: 'utf-8' });
  writeFileSync(join(enOutputDir, 'rss.xml'), enRss, { encoding: 'utf-8' });
  
  console.log('RSS feeds generated successfully!');
}

main();
