import puppeteer from "puppeteer";
import { mkdir, readdir } from "node:fs/promises";
import { join } from "node:path";

const SCREENSHOT_DIR = "./temporary screenshots";
const url = process.argv[2];
const label = process.argv[3] || "";

if (!url) {
  console.error("Usage: node screenshot.mjs <url> [label]");
  process.exit(1);
}

await mkdir(SCREENSHOT_DIR, { recursive: true });

// Determine next auto-incremented number
const files = await readdir(SCREENSHOT_DIR);
const nums = files
  .map((f) => f.match(/^screenshot-(\d+)/))
  .filter(Boolean)
  .map((m) => parseInt(m[1], 10));
const next = nums.length ? Math.max(...nums) + 1 : 1;

const suffix = label ? `-${label}` : "";
const filename = `screenshot-${next}${suffix}.png`;
const filepath = join(SCREENSHOT_DIR, filename);

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

// Wait a moment for any animations/fonts to settle
await new Promise((r) => setTimeout(r, 1000));

await page.screenshot({ path: filepath, fullPage: true });
await browser.close();

console.log(`Screenshot saved: ${filepath}`);
