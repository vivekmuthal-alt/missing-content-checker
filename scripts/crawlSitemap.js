#!/usr/bin/env node
/*
 Simple sitemap crawler
 Usage: node scripts/crawlSitemap.js https://example.com [maxPages]
 Writes sitemap to sitemap-crawled.xml in project root
*/
const fs = require('fs');
const url = require('url');
const cheerio = require('cheerio');

const start = process.argv[2];
const maxPages = parseInt(process.argv[3] || '500', 10);

if (!start) {
  console.error('Usage: node scripts/crawlSitemap.js https://example.com [maxPages]');
  process.exit(1);
}

const origin = new URL(start).origin;
const queue = [start];
const seen = new Set();
const results = [];

async function fetchHtml(u) {
  try {
    const res = await fetch(u);
    if (!res.ok) return null;
    const text = await res.text();
    return text;
  } catch (e) {
    return null;
  }
}

function normalizeLink(href) {
  if (!href) return null;
  try {
    const parsed = new URL(href, origin);
    if (parsed.origin !== origin) return null;
    // remove hash
    parsed.hash = '';
    // remove trailing slash
    let p = parsed.pathname + parsed.search;
    if (p !== '/' && p.endsWith('/')) p = p.slice(0, -1);
    return parsed.origin + p;
  } catch (e) {
    return null;
  }
}

async function crawl() {
  while (queue.length && results.length < maxPages) {
    const u = queue.shift();
    if (seen.has(u)) continue;
    seen.add(u);
    console.log('Crawling', u);
    const html = await fetchHtml(u);
    if (!html) continue;
    results.push(u);
    const $ = cheerio.load(html);
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      const n = normalizeLink(href);
      if (n && !seen.has(n) && !queue.includes(n)) queue.push(n);
    });
  }

  // build XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  results.forEach((u) => {
    xml += '  <url>\n';
    xml += `    <loc>${u}</loc>\n`;
    xml += '  </url>\n';
  });
  xml += '</urlset>';

  fs.writeFileSync('sitemap-crawled.xml', xml, 'utf8');
  console.log('Sitemap written to sitemap-crawled.xml (' + results.length + ' URLs)');
}

crawl();
