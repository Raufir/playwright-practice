import { Page, Locator } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly addToCartLink: Locator;
  readonly cartTotal: Locator;

  constructor(page: Page) {
    this.page = page;
    // Text/role-based - matches what a real user reads, survives refactors
    this.addToCartLink = page.getByRole('link', { name: 'Add to Cart' });
    // HEALED (Phase 5): re-inspected the live page via curl, confirmed the
    // real class is still "cart_total" - reverted to the scoped selector
    // from Phase 4, which also avoids the unrelated ".container-fluid.cart_total" div
    this.cartTotal = page.locator('.nav.topcart .dropdown-toggle .cart_total');
  }

  async goto(productId: string) {
    await this.page.goto(`/index.php?rt=product/product&product_id=${productId}`);
  }

  async addToCart() {
    await this.addToCartLink.click();
  }

  // No assertion here - the page object exposes cartTotal as a Locator,
  // and the TEST decides what "correct" means (e.g. not "$0.00").
}
