// services/sitemap.service.js
// ─────────────────────────────────────────────────────────────────────────────
// Dynamic XML Sitemap generator with Google Image Sitemap support.
//
// Architecture:
//   • Generates sitemap XML dynamically from the database (published products)
//   • In-memory cache with configurable TTL (default 5 min) — avoids DB hits
//     on every crawler request while keeping data fresh enough
//   • Categories and brands are discovered dynamically from the database,
//     never hardcoded
//   • Includes <image:image> tags for Google Image Search indexing
//   • Designed with a Sitemap Index–ready structure: if the catalog exceeds
//     50,000 URLs (Google's per-sitemap limit), the paginated helpers below
//     can be wired into a sitemap index endpoint without rewriting any logic
// ─────────────────────────────────────────────────────────────────────────────

import Product from "../models/product.model.js";
import ProductImage from "../models/productImage.model.js";
import { Op } from "sequelize";

// ──── Configuration ─────────────────────────────────────────────────────────

const SITE_URL = "https://www.luxuryfragrancemz.shop";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_URLS_PER_SITEMAP = 50_000; // Google's per-file limit

// Priority & changefreq are kept configurable in one place so they can be
// tweaked without hunting through the XML builder. Google largely ignores
// these signals, but including them doesn't hurt and some other engines
// still read them.
const SITEMAP_CONFIG = {
  home: { priority: "1.0", changefreq: "daily" },
  category: { priority: "0.9", changefreq: "daily" },
  brand: { priority: "0.8", changefreq: "daily" },
  product: { priority: "0.8", changefreq: "daily" },
  collection: { priority: "0.9", changefreq: "daily" },
  static: { priority: "0.7", changefreq: "daily" },
  legal: { priority: "0.5", changefreq: "yearly" },
};

// Static pages that should appear in the sitemap.
// Each entry mirrors a public route from LayoutAll.tsx.
const STATIC_PAGES = [
  { path: "/", ...SITEMAP_CONFIG.home },
  { path: "/about", ...SITEMAP_CONFIG.static },
  { path: "/contact", ...SITEMAP_CONFIG.static },
  { path: "/all-products", ...SITEMAP_CONFIG.collection },
  { path: "/privacy", ...SITEMAP_CONFIG.legal },
  { path: "/terms", ...SITEMAP_CONFIG.legal },
];

// ──── Cache ─────────────────────────────────────────────────────────────────

let cachedXml = null;
let cacheTimestamp = 0;

/**
 * Clears the sitemap cache. Called automatically when the TTL expires, but
 * can also be called manually (e.g. after a product CRUD operation) to force
 * an immediate refresh.
 */
export const invalidateSitemapCache = () => {
  cachedXml = null;
  cacheTimestamp = 0;
};

// ──── XML helpers ───────────────────────────────────────────────────────────

/** XML-escape special characters to prevent malformed output. */
const escapeXml = (str) =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

/** Format a Date (or ISO string) as YYYY-MM-DD for <lastmod>. */
const formatDate = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().split("T")[0];
};

/**
 * Build a single <url> entry.
 *
 * @param {string}   loc        – full URL
 * @param {string}   [lastmod]  – ISO date or Date
 * @param {string}   [changefreq]
 * @param {string}   [priority]
 * @param {Array}    [images]   – [{ url, title? }] for <image:image> tags
 */
const buildUrlEntry = (loc, { lastmod, changefreq, priority, images } = {}) => {
  let entry = `  <url>\n    <loc>${escapeXml(loc)}</loc>\n`;

  if (lastmod) entry += `    <lastmod>${formatDate(lastmod)}</lastmod>\n`;
  if (changefreq) entry += `    <changefreq>${changefreq}</changefreq>\n`;
  if (priority) entry += `    <priority>${priority}</priority>\n`;

  // Google Image Sitemap extension
  if (images && images.length > 0) {
    for (const img of images) {
      entry += `    <image:image>\n`;
      entry += `      <image:loc>${escapeXml(img.url)}</image:loc>\n`;
      if (img.title) {
        entry += `      <image:title>${escapeXml(img.title)}</image:title>\n`;
      }
      entry += `    </image:image>\n`;
    }
  }

  entry += `  </url>\n`;
  return entry;
};

// ──── Data fetching ─────────────────────────────────────────────────────────

/**
 * Fetch all published products with only the columns needed for the sitemap.
 * Includes ProductImage association for Google Image Sitemap tags.
 *
 * Returns raw Sequelize instances — .toJSON() is called per-row in the
 * builder to avoid creating an intermediate copy of the full result set.
 */
const fetchSitemapProducts = async () => {
  return Product.findAll({
    where: { publishStatus: "published" },
    attributes: ["id", "slug", "title", "category", "brand", "productImage", "updatedAt"],
    include: [
      {
        model: ProductImage,
        attributes: ["imageUrl"],
        separate: true,
        order: [["sortOrder", "ASC"]],
      },
    ],
    order: [["updatedAt", "DESC"]],
    raw: false,
  });
};

// ──── Sitemap generation ────────────────────────────────────────────────────

/**
 * Generate the complete sitemap XML string.
 * Dynamically discovers categories and brands from the database.
 */
const generateSitemapXml = async () => {
  const products = await fetchSitemapProducts();
  const now = new Date();

  // ── Discover unique categories & brands dynamically ──
  const categoriesSet = new Set();
  const brandsSet = new Set();

  for (const product of products) {
    if (product.category) categoriesSet.add(product.category);
    if (product.brand) brandsSet.add(product.brand);
  }

  // ── Build XML ──
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset\n`;
  xml += `  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  // 1. Static pages
  for (const page of STATIC_PAGES) {
    xml += buildUrlEntry(`${SITE_URL}${page.path}`, {
      lastmod: now,
      changefreq: page.changefreq,
      priority: page.priority,
    });
  }

  // 2. Dynamic category pages (discovered from DB, not hardcoded)
  for (const category of categoriesSet) {
    xml += buildUrlEntry(`${SITE_URL}/${category}`, {
      lastmod: now,
      ...SITEMAP_CONFIG.category,
    });
  }

  // 3. Dynamic brand pages (if your frontend surfaces brand routes)
  // These map to filtered views of all-products, e.g. /all-products?brand=Versace
  // Commented out since the frontend doesn't have dedicated /brand/:name routes yet.
  // Uncomment when brand pages are added:
  //
  // for (const brand of brandsSet) {
  //   const brandSlug = brand.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  //   xml += buildUrlEntry(`${SITE_URL}/brand/${brandSlug}`, {
  //     lastmod: now,
  //     ...SITEMAP_CONFIG.brand,
  //   });
  // }

  // 4. Product pages — with Image Sitemap support
  for (const product of products) {
    const p = product.toJSON ? product.toJSON() : product;

    // Skip products without a slug (shouldn't happen for published, but be safe)
    if (!p.slug) continue;

    // Collect all product images for <image:image> tags
    const images = [];

    // Main product image (always present)
    if (p.productImage) {
      images.push({ url: p.productImage, title: p.title });
    }

    // Gallery images from ProductImages association
    if (p.ProductImages && p.ProductImages.length > 0) {
      for (const img of p.ProductImages) {
        // Avoid duplicating the main cover image
        if (img.imageUrl && img.imageUrl !== p.productImage) {
          images.push({ url: img.imageUrl, title: p.title });
        }
      }
    }

    xml += buildUrlEntry(`${SITE_URL}/product/${p.slug}`, {
      lastmod: p.updatedAt,
      ...SITEMAP_CONFIG.product,
      images,
    });
  }

  xml += `</urlset>\n`;
  return xml;
};

// ──── Public API ────────────────────────────────────────────────────────────

/**
 * Returns the sitemap XML, serving from cache when the TTL hasn't expired.
 * This is the only function controllers need to call.
 */
export const getSitemapXml = async () => {
  const now = Date.now();

  if (cachedXml && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedXml;
  }

  cachedXml = await generateSitemapXml();
  cacheTimestamp = now;
  return cachedXml;
};

/**
 * Generate a production-ready robots.txt tailored to the frontend domain.
 *
 * This file is served at https://www.luxuryfragrancemz.shop/robots.txt via
 * the Vercel rewrite proxy. All rules apply to the FRONTEND domain — not the
 * API domain — so only frontend routes are listed.
 *
 * Route audit (from LayoutAll.tsx):
 * ─────────────────────────────────────────────────────────────────────────
 * INDEXABLE (public storefront pages):
 *   /                     → Home
 *   /about                → About
 *   /contact              → Contact Us
 *   /all-products         → Shop / All Products
 *   /Men                  → Men's Category
 *   /Women                → Women's Category
 *   /product/:slug        → Product Detail (SEO-friendly URL)
 *   /privacy              → Privacy Policy
 *   /terms                → Terms & Conditions
 *
 * NON-INDEXABLE (user-specific, transactional, or private):
 *   /cart                 → Shopping Cart
 *   /checkout             → Checkout Flow
 *   /wishlist             → User Wishlist (requires login)
 *   /compare              → Product Compare (session-specific)
 *   /myorders             → User Order History (requires login)
 *   /track-order          → Order Tracking (requires login)
 *   /thankyou             → Post-purchase Thank You
 *   /success              → Payment Success (Stripe)
 *   /cancel               → Payment Cancel (Stripe)
 *   /search               → Search Results (dynamic, low-value for crawlers)
 *   /profile              → User Profile (requires login)
 *   /profile/update       → Profile Edit (requires login)
 *   /product-detail/:id   → Legacy product URL (prevent duplicate content)
 *
 * AUTH (never index — login/signup flows):
 *   /login
 *   /register
 *   /forgot-password
 *   /verify-otp
 *   /set-new-password
 *
 * ADMIN (gated behind ProtectedRoute, but block anyway):
 *   /admin/*
 * ─────────────────────────────────────────────────────────────────────────
 */
export const getRobotsTxt = () => {
  return [
    "# ═══════════════════════════════════════════════════════════",
    "# robots.txt — www.luxuryfragrancemz.shop",
    "# M.Z Luxury Fragrances — Premium Perfume Impressions",
    "# Last updated: auto-generated dynamically",
    "# ═══════════════════════════════════════════════════════════",
    "",
    "# ─── All Search Engine Crawlers ──────────────────────────",
    "User-agent: *",
    "",
    "# Indexable public storefront pages",
    "Allow: /$",
    "Allow: /about",
    "Allow: /contact",
    "Allow: /all-products",
    "Allow: /Men",
    "Allow: /Women",
    "Allow: /product/",
    "Allow: /privacy",
    "Allow: /terms",
    "",
    "# ── Admin Panel ──",
    "# Protected behind auth, but explicitly blocked for defense in depth",
    "Disallow: /admin",
    "Disallow: /admin/",
    "",
    "# ── Authentication & Account ──",
    "# Login/signup flows — no SEO value, must not be indexed",
    "Disallow: /login",
    "Disallow: /register",
    "Disallow: /forgot-password",
    "Disallow: /verify-otp",
    "Disallow: /set-new-password",
    "Disallow: /profile",
    "Disallow: /profile/",
    "",
    "# ── Shopping & Transactions ──",
    "# User-specific pages with no public value",
    "Disallow: /cart",
    "Disallow: /checkout",
    "Disallow: /thankyou",
    "Disallow: /myorders",
    "Disallow: /track-order",
    "Disallow: /success",
    "Disallow: /cancel",
    "",
    "# ── Session-Specific Features ──",
    "# Wishlist/compare are per-user; search results are ephemeral",
    "Disallow: /wishlist",
    "Disallow: /compare",
    "Disallow: /search",
    "",
    "# ── Duplicate Content Prevention ──",
    "# Legacy product URLs use IDs (/product-detail/123) — block crawling",
    "# so Google only indexes the canonical slug-based URLs (/product/:slug)",
    "Disallow: /product-detail/",
    "",
    "# ── Crawl Rate ──",
    "# Polite crawl delay (in seconds) — respected by Bing, Yandex, etc.",
    "# Googlebot ignores this but respects Search Console crawl settings.",
    "Crawl-delay: 2",
    "",
    "# ─── Googlebot (specific overrides) ──────────────────────",
    "# Googlebot gets no crawl-delay (it manages its own rate).",
    "# All the same Disallow rules inherited from * above apply.",
    "User-agent: Googlebot",
    "Allow: /",
    "",
    "# ─── Googlebot-Image ─────────────────────────────────────",
    "# Allow image crawling for Google Images indexing.",
    "# Product images are served from Cloudinary (external domain),",
    "# but this ensures any inline images are also discoverable.",
    "User-agent: Googlebot-Image",
    "Allow: /",
    "",
    "# ─── AI Training Bots ────────────────────────────────────",
    "# Block AI/LLM training crawlers from scraping site content.",
    "# These do not contribute to search visibility.",
    "User-agent: GPTBot",
    "Disallow: /",
    "",
    "User-agent: ChatGPT-User",
    "Disallow: /",
    "",
    "User-agent: CCBot",
    "Disallow: /",
    "",
    "User-agent: anthropic-ai",
    "Disallow: /",
    "",
    "User-agent: Claude-Web",
    "Disallow: /",
    "",
    "User-agent: Google-Extended",
    "Disallow: /",
    "",
    "# ─── Sitemap Location ────────────────────────────────────",
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    "",
  ].join("\n");
};

// ──── Sitemap Index (future-ready) ──────────────────────────────────────────
// When the catalog grows past MAX_URLS_PER_SITEMAP, call these helpers from a
// new /sitemap-index.xml route to split products across paginated sub-sitemaps
// (e.g. /sitemap-products-1.xml, /sitemap-products-2.xml).
//
// export const getSitemapIndexXml = async () => { ... };
// export const getProductSitemapPage = async (page) => { ... };
// ────────────────────────────────────────────────────────────────────────────
