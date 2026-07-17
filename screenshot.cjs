const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  // 访问首页
  await page.goto('http://localhost:5173');
  await page.wait_for_load_state ? null : null;
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // 登录
  await page.fill('input[type="tel"]', '13800138001');
  await page.fill('input[type="password"]', '123456');
  await page.click('button:has-text("登录")');
  await page.waitForTimeout(2000);

  // 截图首页（全页）
  await page.screenshot({ path: 'home_screenshot.png', fullPage: true });
  console.log('首页截图已保存');

  await browser.close();
})();
