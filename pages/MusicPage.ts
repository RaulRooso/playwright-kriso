import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class MusicPage extends BasePage {
  private readonly resultsTotal: Locator;
  private readonly filterContainer: Locator;
  private readonly activeFiltersContainer: Locator;

  constructor(page: Page) {
    super(page);
    this.resultsTotal = this.page.locator('.sb-results-total');
    this.filterContainer = this.page.locator('#filters-content-wrap');
    this.activeFiltersContainer = this.page.locator('#active-filters');
  }

  async verifyUrl(pattern: RegExp) {
    await expect(this.page).toHaveURL(pattern);
  }

  async applyFilter(categoryName: string, filterValue: string) {
    // If categoryName is empty, search in the whole filter wrap (for the Kitarr link)
    const scope = categoryName 
      ? this.page.locator('.filter', { hasText: categoryName }) 
      : this.filterContainer;
    
    await scope.getByText(filterValue).first().click();
  }

  async removeActiveFilter(filterText: string) {
    const filterBox = this.page.locator('.srcfilter', { hasText: filterText });
    await filterBox.locator('.del_srcfilter').click();
  }

  async verifyActiveFilterVisible(text: string, isVisible: boolean = true) {
    if (isVisible) {
      await expect(this.activeFiltersContainer).toContainText(text);
    } else {
      await expect(this.activeFiltersContainer).not.toContainText(text);
    }
  }

  async getResultCount(): Promise<number> {
    const text = await this.resultsTotal.textContent();
    return Number(text?.replace(/\D/g, '') || 0);
  }
}