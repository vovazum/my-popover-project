const puppeteer = require('puppeteer');

jest.setTimeout(30000); // Увеличим общий тайм-аут для всех тестов

describe('Popover Test', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: false, // Для отладки можно сделать не headless
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            slowMo: 50
        });
        page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });
        await page.goto('http://localhost:8080', { waitUntil: 'networkidle0' });
    });

    it('должен показывать popover при клике', async () => {
        const isPopoverVisible = await page.$eval('#popover', el => el.classList.contains('show'));
        expect(isPopoverVisible).toBe(false);

        console.log("Нажатие на кнопку");
        await page.click('#popover-trigger');
        await page.waitForTimeout(500); 

        // Увеличиваем время ожидания до 20 секунд
        console.log("Ожидание появления поповера");
        await page.waitForFunction(
            () => document.getElementById('popover').classList.contains('show'),
            { timeout: 20000 }
        );

        const isVisible = await page.$eval('#popover', el => el.classList.contains('show'));
        expect(isVisible).toBe(true);
    });

    it('popover должен быть центрирован по горизонтали относительно кнопки', async () => {
        console.log("Ожидание появления поповера");
        await page.waitForSelector('#popover.show', { visible: true, timeout: 20000 });

        const triggerRect = await page.$eval('#popover-trigger', el => {
            const rect = el.getBoundingClientRect();
            return { x: rect.left + window.scrollX, width: rect.width };
        });

        const popoverRect = await page.$eval('#popover', el => {
            const rect = el.getBoundingClientRect();
            return { x: rect.left + window.scrollX, width: rect.width };
        });

        const popoverCenter = popoverRect.x + popoverRect.width / 2;
        const triggerCenter = triggerRect.x + triggerRect.width / 2;
        const difference = Math.abs(popoverCenter - triggerCenter);

        console.log(`Отклонение центрирования: ${difference}px`);
        expect(difference).toBeLessThan(10); 
    });

    afterAll(async () => {
        await browser.close();
    });
});
