// routes/sitemap.route.js
// ─────────────────────────────────────────────────────────────────────────────
// Express routes for /sitemap.xml and /robots.txt.
// Both are public, unauthenticated, and lightweight — they serve from cache
// most of the time (see sitemap.service.js).
// ─────────────────────────────────────────────────────────────────────────────

import express from "express";
import { getSitemapXml, getRobotsTxt } from "../services/sitemap.service.js";

const router = express.Router();

// GET /sitemap.xml — dynamic XML sitemap
router.get("/sitemap.xml", async (req, res) => {
  try {
    const xml = await getSitemapXml();

    // Cache headers: let CDN/browser cache for 1 hour, revalidate after that.
    // The in-memory service cache (5 min TTL) handles freshness on the server
    // side, so a 1-hour public cache is safe — the worst-case staleness is the
    // time between a product change and the next CDN purge/expiry.
    res.set("Content-Type", "application/xml; charset=utf-8");
    res.set("Cache-Control", "public, max-age=3600, s-maxage=3600");
    res.status(200).send(xml);
  } catch (error) {
    console.error("Sitemap generation failed:", error);
    res.status(500).send("<?xml version=\"1.0\" encoding=\"UTF-8\"?><error>Sitemap generation failed</error>");
  }
});

// GET /robots.txt — dynamic robots.txt
router.get("/robots.txt", (req, res) => {
  const txt = getRobotsTxt();
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.set("Cache-Control", "public, max-age=86400"); // 24h
  res.status(200).send(txt);
});

export default router;
