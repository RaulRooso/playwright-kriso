import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { MusicPage } from '../../pages/MusicPage';

test.describe.configure({ mode: 'serial' });

let page: Page;
let homePage: HomePage;
let musicPage: MusicPage;
let previousCount = 0;

test.describe('Navigate Products via Filters (POM)', () => {
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    homePage = new HomePage(page);

    await homePage.openUrl();
    await homePage.acceptCookies();
  });

  test.afterAll(async () => {
    await page.context().close();
  });

  test('Navigate to Music Books', async () => {
    musicPage = await homePage.navigateToMusicBooks();
    await musicPage.verifyUrl(/muusika-ja-noodid/);
  });

  test('Apply filter: kitarr', async () => {
    await musicPage.applyFilter('', 'Kitarr');
    await musicPage.verifyUrl(/instrument=Guitar/);
    
    previousCount = await musicPage.getResultCount();
    expect(previousCount).toBeGreaterThan(1);
  });

  test('Filter by language: Inglise', async () => {
    await musicPage.applyFilter('Keel', 'Inglise');
    await musicPage.verifyActiveFilterVisible('Inglise');
    
    const currentCount = await musicPage.getResultCount();
    expect(currentCount).toBeLessThan(previousCount);
    previousCount = currentCount;
  });

  test('Filter by format: CD', async () => {
    await musicPage.applyFilter('Formaat', 'CD');
    await musicPage.verifyActiveFilterVisible('CD');
    
    const currentCount = await musicPage.getResultCount();
    expect(currentCount).toBeLessThan(previousCount);
    previousCount = currentCount;
  });

  test('Remove filters and verify count increases', async () => {
    // Remove English
    await musicPage.removeActiveFilter('Inglise');
    await musicPage.verifyActiveFilterVisible('Inglise', false);
    let currentCount = await musicPage.getResultCount();
    expect(currentCount).toBeGreaterThan(previousCount);
    previousCount = currentCount;

    // Remove Kitarr
    await musicPage.removeActiveFilter('Kitarr');
    await musicPage.verifyActiveFilterVisible('Kitarr', false);
    currentCount = await musicPage.getResultCount();
    expect(currentCount).toBeGreaterThan(previousCount);
  });
});