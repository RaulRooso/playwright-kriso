import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  private readonly breadcrumbLast: Locator;

  constructor(page: Page) {
    super(page);
    this.breadcrumbLast = this.page.locator('.pb-loc-last');
  }

  async verifyProductTitle(expectedTitle: string) {
    await expect(this.breadcrumbLast).toContainText(expectedTitle);
  }

  async verifyUrlContains(isbn: string) {
    await expect(this.page).toHaveURL(new RegExp(isbn));
  }
}