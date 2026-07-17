from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        viewport={'width': 390, 'height': 844},
        device_scale_factor=2,
    )
    page = context.new_page()
    page.goto('http://localhost:5173')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(2000)

    # 先登录
    page.fill('input[type="tel"]', '13800138001')
    page.fill('input[type="password"]', '123456')
    page.click('button:has-text("登录")')
    page.wait_for_timeout(2000)

    # 截图首页
    page.screenshot(path='home_screenshot.png', full_page=True)
    print("首页截图已保存")
    browser.close()
