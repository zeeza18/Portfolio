const { chromium } = require('playwright');

async function capturePortfolio() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: 'demos/',
      size: { width: 1920, height: 1080 }
    }
  });
  const page = await context.newPage();

  console.log('Starting portfolio capture...\n');

  // Capture video of intro with audio
  console.log('Recording intro sequence with audio...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000); // Let intro play with sound

  // Screenshots
  const screenshots = [
    { name: 'intro', url: 'http://localhost:3000/', wait: 3000, desc: 'Netflix-style intro' },
    { name: 'profiles', url: 'http://localhost:3000/browse', wait: 2000, desc: 'Profile selection' },
    { name: 'dashboard', url: 'http://localhost:3000/profile/recruiter', wait: 2000, desc: 'Main dashboard' },
    { name: 'experience', url: 'http://localhost:3000/work-experience', wait: 2000, desc: 'Work experience timeline' },
    { name: 'skills', url: 'http://localhost:3000/skills', wait: 2000, desc: 'Skills page' },
    { name: 'projects', url: 'http://localhost:3000/projects', wait: 2000, desc: 'Projects showcase' },
    { name: 'certifications', url: 'http://localhost:3000/certifications', wait: 2000, desc: 'Certifications' },
    { name: 'social', url: 'http://localhost:3000/social', wait: 2000, desc: 'Social feed' },
    { name: 'contact', url: 'http://localhost:3000/contact-me', wait: 2000, desc: 'Contact page' },
  ];

  for (const { name, url, wait, desc } of screenshots) {
    try {
      console.log(`Capturing ${desc}...`);
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(wait);
      await page.screenshot({
        path: `screenshots/${name}.png`,
        fullPage: false
      });
      console.log(`✓ Saved screenshots/${name}.png`);
    } catch (error) {
      console.error(`✗ Failed to capture ${name}:`, error.message);
    }
  }

  console.log('\nClosing browser and saving video...');
  await context.close();
  await browser.close();

  console.log('\n✓ Video saved to demos/ folder');
  console.log('✓ Screenshots saved to screenshots/ folder');
}

capturePortfolio().catch(console.error);
