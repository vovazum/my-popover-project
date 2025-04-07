const puppeteer = require('puppeteer');

describe('Popover Test', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      slowMo: 50,
    });

    page = await browser.newPage();
    await page.goto('http://localhost:8080');
  });

  afterAll(async () => {
    await browser.close();
  });

  test('должен показывать popover при клике', async () => {
    console.log('Нажатие на кнопку');
    await page.click('#popover-trigger');

    console.log('Ожидание появления поповера');

    await page.waitForFunction(() => {
      const el = document.querySelector('#popover');
      return el && el.classList.contains('show') && getComputedStyle(el).opacity === '1';
    }, { timeout: 3000 }); // меньше времени, быстрее упадёт при ошибке
  });

  test('popover должен быть центрирован по горизонтали относительно кнопки', async () => {
    console.log('Ожидание появления поповера');

    await page.waitForFunction(() => {
      const el = document.querySelector('#popover');
      return el && el.classList.contains('show') && getComputedStyle(el).opacity === '1';
    }, { timeout: 3000 });

    const triggerBox = await page.$eval('#popover-trigger', el => el.getBoundingClientRect());
    const popoverBox = await page.$eval('#popover', el => el.getBoundingClientRect());

    const triggerCenter = triggerBox.left + triggerBox.width / 2;
    const popoverCenter = popoverBox.left + popoverBox.width / 2;

    const diff = Math.abs(triggerCenter - popoverCenter);

    // Позволим небольшую погрешность в пикселях
    expect(diff).toBeLessThanOrEqual(5);
  });
});
