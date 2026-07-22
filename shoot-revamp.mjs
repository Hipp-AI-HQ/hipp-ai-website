import puppeteer from "puppeteer";

const OUT = "./temporary screenshots";
const url = "http://localhost:3001";

const browser = await puppeteer.launch({ headless: true });

async function capture(width, height, label) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
  // scroll through the page to fire whileInView animations
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = "auto";
    const step = window.innerHeight * 0.7;
    for (let y = 0; y <= document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: `${OUT}/revamp-${label}.png`, fullPage: true });
  console.log(`saved revamp-${label}.png`);
  await page.close();
}

await capture(1440, 900, "desktop");
await capture(390, 844, "mobile");
await browser.close();
