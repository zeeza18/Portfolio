const { chromium } = require('playwright');

async function captureScreenshots() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  const screenshots = [
    { name: '01-intro', url: 'http://localhost:3000/', wait: 3000 },
    { name: '02-browse', url: 'http://localhost:3000/browse', wait: 2000 },
    { name: '03-profile-recruiter', url: 'http://localhost:3000/profile/recruiter', wait: 2000 },
    { name: '04-work-experience', url: 'http://localhost:3000/work-experience', wait: 2000 },
    { name: '05-skills', url: 'http://localhost:3000/skills', wait: 2000 },
    { name: '06-projects', url: 'http://localhost:3000/projects', wait: 2000 },
    { name: '07-certifications', url: 'http://localhost:3000/certifications', wait: 2000 },
    { name: '08-social', url: 'http://localhost:3000/social', wait: 2000 },
    { name: '09-contact', url: 'http://localhost:3000/contact-me', wait: 2000 },
  ];

  console.log('Starting screenshot capture...\n');

  for (const { name, url, wait } of screenshots) {
    try {
      console.log(`Capturing ${name}...`);
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(wait);
      await page.screenshot({
        path: `screenshots/${name}.png`,
        fullPage: true
      });
      console.log(`✓ Saved screenshots/${name}.png`);
    } catch (error) {
      console.error(`✗ Failed to capture ${name}:`, error.message);
    }
  }

  console.log('\nAll screenshots captured!');
  await browser.close();
}

captureScreenshots().catch(console.error);
