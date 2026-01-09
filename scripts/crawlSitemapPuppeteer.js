#!/usr/bin/env node
/*
 Puppeteer sitemap crawler
 Usage: node scripts/crawlSitemapPuppeteer.js https://example.com [maxPages]
 Writes sitemap to sitemap-crawled-puppeteer.xml
*/
const fs = require('fs');
const { URL } = require('url');
const puppeteer = require('puppeteer');

const startUrl = process.argv[2];
const maxPages = parseInt(process.argv[3] || '500', 10);

if (!startUrl) {
  console.error('Usage: node scripts/crawlSitemapPuppeteer.js https://example.com [maxPages]');
  process.exit(1);
}

function normalize(u) {
  try {
    const url = new URL(u);
    // strip hash
    url.hash = '';
    // remove trailing slash except root
    if (url.pathname !== '/' && url.pathname.endsWith('/')) url.pathname = url.pathname.slice(0, -1);
    return url.toString();
  } catch (e) {
    return null;
  }
}

(async () => {
  const origin = new URL(startUrl).origin;
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(30000);

  const queue = [startUrl];
  const seen = new Set();
  const results = [];

  while (queue.length && results.length < maxPages) {
    const u = queue.shift();
    const n = normalize(u);
    if (!n || seen.has(n)) continue;
    seen.add(n);
    console.log('Crawling', n);
    try {
      await page.goto(n, { waitUntil: 'networkidle2' });
    } catch (e) {
      console.warn('Failed to load', n);
      continue;
    }

    results.push(n);

    // extract links
    const hrefs = await page.$$eval('a[href]', as => as.map(a => a.getAttribute('href')));
    for (let href of hrefs) {
      if (!href) continue;
      try {
        const abs = new URL(href, n).toString();
        if (!abs.startsWith(origin)) continue;
        const norm = normalize(abs);
        if (norm && !seen.has(norm) && !queue.includes(norm)) queue.push(norm);
      } catch (e) {
        continue;
      }
    }
  }

  await browser.close();

  // build XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  results.forEach(u => {
    xml += '  <url>\n';
    xml += `    <loc>${u}</loc>\n`;
    xml += '  </url>\n';
  });
  xml += '</urlset>';

  const out = 'sitemap-crawled-puppeteer.xml';
  fs.writeFileSync(out, xml, 'utf8');
  console.log(`Sitemap written to ${out} (${results.length} URLs)`);
})();
