import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

let page: Page;
let previousSearchResults = 0;

test.describe('Navigate Products via Filters', () => {
    test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();

    await page.goto('https://www.kriso.ee/');
    await page.getByRole('button', { name: 'Nõustun' }).click();
  });

  test.afterAll(async () => {
    await page.context().close();
  });

  test('Navigate and filter Music Books', async () => {
    await page.locator('.nav-wrap',{hasText: 'Muusikaraamatud ja noodid'}).click();
    await expect(page).toHaveURL(/muusika-ja-noodid/);

    // console.log('Current URL is:', page.url());
  });

  test('Apply filter: kitarr', async () => {
    await page.locator('#filters-content-wrap').getByText('Kitarr').first().click();
    
    await expect(page).toHaveURL(/instrument=Guitar/);
    previousSearchResults = await getResultCount(page); 
    expect(previousSearchResults).toBeGreaterThan(1);

    // console.log(`Kitarr results: ${previousSearchResults}`);
      console.log(`Previous count of results: ${previousSearchResults}`);
  });

test('Apply filter: inglise', async () => {
      await page.locator('.filter', { hasText: 'Keel' }).getByText('Inglise').first().click();
      
      await expect(page.locator('#active-filters')).toContainText('Inglise');
      const currentCount = await getResultCount(page);
      expect(currentCount).toBeLessThan(previousSearchResults);
      previousSearchResults = currentCount;

      // console.log(`URL after Language: ${page.url()}`);
      console.log(`Current count of results: ${currentCount}`);
      console.log(`Previous count of results: ${previousSearchResults}`);
  });

  test('Apply filter: CD', async () => {
      await page.locator('.filter', { hasText: 'Formaat' }).getByText('CD').first().click();
      await expect(page.locator('#active-filters')).toContainText('CD');
      const currentCount = await getResultCount(page);
      expect(currentCount).toBeLessThan(previousSearchResults);
      previousSearchResults = currentCount;

      // console.log(`URL after Language: ${page.url()}`);
      console.log(`Current count of results: ${currentCount}`);
      console.log(`Previous count of results: ${previousSearchResults}`);
  });

  test('Remove filter: inglise', async () => {

        const filterBox = page.locator('.srcfilter', { hasText: 'Inglise' });
        await filterBox.locator('.del_srcfilter').click();

        await expect(page.locator('#active-filters')).not.toContainText('Inglise');
        const currentCount = await getResultCount(page);
        expect(currentCount).toBeGreaterThan(previousSearchResults);
        previousSearchResults = currentCount;

        console.log(`Filter removed. Count increased to: ${currentCount}`);
    });

  test('Remove filter: kitarr', async () => {
        const filterBox = page.locator('.srcfilter', { hasText: 'Kitarr' });
        await filterBox.locator('.del_srcfilter').click();

        await expect(page.locator('#active-filters')).not.toContainText('Kitarr');
        const currentCount = await getResultCount(page);
        expect(currentCount).toBeGreaterThan(previousSearchResults);
        previousSearchResults = currentCount;

        console.log(`Filter removed. Count increased to: ${currentCount}`);
    });

  // test('Remove filter: CD', async () => {
  //       const filterBox = page.locator('.srcfilter', { hasText: 'CD' });
  //       await filterBox.locator('.del_srcfilter').click();

  //       await expect(page.locator('#active-filters')).not.toContainText('CD');
  //       const currentCount = await getResultCount(page);
  //       expect(currentCount).toBeGreaterThan(previousSearchResults);
  //       previousSearchResults = currentCount;

  //       console.log(`Filter removed. Count increased to: ${currentCount}`);
  //   });
});

async function getResultCount(page: Page): Promise<number> {
    const text = await page.locator('.sb-results-total').textContent();
    return Number(text?.replace(/\D/g, '') || 0);
  }


 

