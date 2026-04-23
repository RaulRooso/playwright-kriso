/**
 * Part II — Page Object Model tests
 * Test suite: Search for Books by Keywords
 *
 * Rules:
 *   - No raw selectors in test files — all locators live in page classes
 *   - Use only: getByRole, getByText, getByPlaceholder, getByLabel
 */
import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { ProductPage } from '../../pages/ProductPage';

let page: Page;
let homePage: HomePage;
let productPage: ProductPage;

test.describe('Search for Books by Keywords (POM)', () => {

  test.beforeAll(async ({ browser }) => {
      const context = await browser.newContext();
      page = await context.newPage();
  
      homePage = new HomePage(page);
      productPage = new ProductPage(page);
  
      await homePage.openUrl();
      await homePage.acceptCookies();
    });
  
    test.afterAll(async () => {
      await page.context().close();
    });
  
    test('Test logo is visible', async () => {
      await homePage.verifyLogo();
    }); 

    test('Test no products found', async () => {
      await homePage.searchByKeyword('jaslkfjalskjdkls');
      await homePage.verifyNoProductsFoundMessage();
    });

    test('Test search results contain keyword', async () => {
      await homePage.searchByKeyword('tolkien');
      await homePage.verifyResultsCountMoreThan(1);
      await homePage.verifyActiveFilterContains('tolkien');
      await homePage.verifyResultsTotalVisible();
      await homePage.verifyResultsTotalNotEmpty();
    });

    test('Test search by ISBN', async () => {
      const isbn = '9780307588371';
      await homePage.searchByKeyword(isbn);

      await productPage.verifyProductTitle('Gone Girl');
      await productPage.verifyUrlContains(isbn);
    });

});
