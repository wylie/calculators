#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const DOMAIN = 'https://simplecalculators.io';

const pagesDir = path.resolve(projectRoot, 'src', 'pages');
const generatedDataPath = path.resolve(projectRoot, 'src', 'react-pages', 'Generated', 'generatedCalculatorData.ts');

const redirectedLegacyRoutes = new Set([
  '/budgeting',
  '/savings-investment',
  '/budgeting-finance',
  '/budgeting-and-finance',
  '/finance',
  '/personal-finance',
  '/money-calculators',
  '/savings-and-investment',
  '/savings-investment-calculators',
  '/loans-and-real-estate',
  '/loans-real-estate',
  '/loan-calculators',
  '/real-estate-calculators',
  '/health-and-lifestyle',
  '/health-lifestyle',
  '/health-and-fitness',
  '/health-fitness',
  '/fitness-calculators',
  '/converters-and-tools',
  '/converters-tools',
  '/conversion-tools',
  '/conversion-calculators',
  '/tools-and-planning',
  '/planning-tools',
]);

const excludedStaticPages = new Set([
  '/404',
  '/[calculator]',
]);

const highPriorityRoutes = new Set([
  '/',
  '/money',
  '/loans',
  '/health',
  '/converters',
  '/tools-planning',
]);

const mediumPriorityRoutes = new Set([
  '/privacy',
  '/terms',
  '/contact',
  '/accessibility',
]);

const getRouteMeta = (routePath) => {
  if (routePath === '/') {
    return { priority: 1.0, changefreq: 'weekly' };
  }

  if (highPriorityRoutes.has(routePath)) {
    return { priority: 0.9, changefreq: 'weekly' };
  }

  if (mediumPriorityRoutes.has(routePath)) {
    return { priority: 0.5, changefreq: 'yearly' };
  }

  return { priority: 0.75, changefreq: 'monthly' };
};

const getStaticPageRoutes = () => {
  const files = fs
    .readdirSync(pagesDir)
    .filter((fileName) => fileName.endsWith('.astro'))
    .filter((fileName) => !fileName.includes('['));

  return files
    .map((fileName) => {
      const routePath = fileName === 'index.astro'
        ? '/'
        : `/${fileName.replace(/\.astro$/, '')}`;
      const sourcePath = path.resolve(pagesDir, fileName);
      const stat = fs.statSync(sourcePath);
      return {
        path: routePath,
        lastmod: stat.mtime.toISOString().split('T')[0],
      };
    })
    .filter((route) => !excludedStaticPages.has(route.path))
    .filter((route) => !redirectedLegacyRoutes.has(route.path));
};

const getGeneratedCalculatorRoutes = () => {
  const content = fs.readFileSync(generatedDataPath, 'utf-8');
  const slugRegex = /slug:\s*'([^']+)'/g;
  const routes = new Map();
  const generatedLastmod = fs.statSync(generatedDataPath).mtime.toISOString().split('T')[0];
  let match;

  while ((match = slugRegex.exec(content)) !== null) {
    const routePath = `/${match[1]}`;
    const isDynamicPlaceholder = routePath.includes('[') || routePath.includes(']');
    if (!redirectedLegacyRoutes.has(routePath) && !isDynamicPlaceholder) {
      routes.set(routePath, generatedLastmod);
    }
  }

  return Array.from(routes, ([path, lastmod]) => ({ path, lastmod }));
};

const staticRoutes = getStaticPageRoutes();
const generatedRoutes = getGeneratedCalculatorRoutes();
const routeMap = new Map();

for (const route of staticRoutes) {
  routeMap.set(route.path, route.lastmod);
}

for (const route of generatedRoutes) {
  if (!routeMap.has(route.path)) {
    routeMap.set(route.path, route.lastmod);
  }
}

const routes = Array.from(routeMap.entries())
  .sort((left, right) => left[0].localeCompare(right[0]))
  .map(([routePath, lastmod]) => ({ path: routePath, lastmod, ...getRouteMeta(routePath) }));

const toCanonicalPath = (routePath) => {
  if (routePath === '/') return '/';
  return routePath.endsWith('/') ? routePath : `${routePath}/`;
};

// Generate sitemap XML
function generateSitemap() {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  const urlsetClose = '</urlset>\n';

  const urlEntries = routes
    .map(
      (route) => `  <url>
    <loc>${DOMAIN}${toCanonicalPath(route.path)}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
    )
    .join('\n');

  return xmlHeader + urlsetOpen + urlEntries + '\n' + urlsetClose;
}

// Write sitemap
const sitemap = generateSitemap();
const outputPath = path.resolve(projectRoot, 'public', 'sitemap.xml');

try {
  fs.writeFileSync(outputPath, sitemap, 'utf-8');
  console.log(`✓ Sitemap generated at ${outputPath}`);
} catch (error) {
  console.error(`✗ Failed to generate sitemap:`, error.message);
  process.exit(1);
}
