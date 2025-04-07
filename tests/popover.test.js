const puppeteer = require('puppeteer');

// Увеличим общий timeout для Jest
jest.setTimeout(30000);

describe('Popover Test', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            slowMo: 50 // Добавим небольшую задержку между действиями
        });
        page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });
        await page.goto('http://localhost:8080', { waitUntil: 'networkidle0' });
    });

    it('должен показывать popover при клике', async () => {
        // Проверяем начальное состояние
        const isPopoverVisible = await page.$eval('#popover', el => el.classList.contains('show'));
        expect(isPopoverVisible).toBe(false); // Поповер должен быть скрыт изначально

        // Кликаем по кнопке
        await page.click('#popover-trigger');
        await page.waitForTimeout(500); // Задержка для отрисовки поповера

        // Ждем, пока поповер станет видимым
        await page.waitForFunction(
            () => document.getElementById('popover').classList.contains('show'),
            { timeout: 10000 }
        );

        // Проверяем, что поповер стал видимым
        const isVisible = await page.$eval('#popover', el => el.classList.contains('show'));
        expect(isVisible).toBe(true);

        // Проверяем, что opacity поповера = 1 (он видим) и pointer-events = 'auto'
        const style = await page.$eval('#popover', el => ({
            opacity: el.style.opacity,
            pointerEvents: el.style.pointerEvents
        }));
        expect(style.opacity).toBe('1');
        expect(style.pointerEvents).toBe('auto');
    });

    it('popover должен быть центрирован по горизонтали относительно кнопки', async () => {
        // Убедимся, что popover видим
        await page.waitForFunction(
            () => document.getElementById('popover').classList.contains('show'),
            { timeout: 10000 }
        );

        const triggerRect = await page.$eval('#popover-trigger', el => {
            const rect = el.getBoundingClientRect();
            return {
                x: rect.left + window.scrollX,
                width: rect.width
            };
        });

        const popoverRect = await page.$eval('#popover', el => {
            const rect = el.getBoundingClientRect();
            return {
                x: rect.left + window.scrollX,
                width: rect.width
            };
        });

        const popoverCenter = popoverRect.x + popoverRect.width / 2;
        const triggerCenter = triggerRect.x + triggerRect.width / 2;
        const difference = Math.abs(popoverCenter - triggerCenter);

        console.log(`Отклонение центрирования: ${difference}px`);
        expect(difference).toBeLessThan(10); // Ожидаем, что отклонение будет меньше 10 пикселей
    });

    afterAll(async () => {
        await browser.close();
    });
});
