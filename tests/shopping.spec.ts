import { test, expect } from '@playwright/test';
import { ProductPage } from '../pages/ProductPage';

test.describe('Browsing and Cart', () => {
  test('Scenario 1: browsing into a category shows products', async ({ page }) => {
    await page.goto('/');
    await page.goto('/index.php?rt=product/category&path=36_38');

    // Real selector, confirmed via curl inspection of the live page's HTML
    const firstProduct = page.locator('.prdocutname').first();
    await expect(firstProduct).toBeVisible();
  });

  test('Scenario 2: adding a product to the cart updates the total', async ({ page }) => {
    // DISCOVERY (Phase 4): the category page's "cart" icon has a real href,
    // and the site's own JS skips the AJAX add-to-cart whenever href isn't
    // "#" - so that icon just navigates instead of adding anything. The REAL
    // working "Add to Cart" is on the product detail page - hence ProductPage.
    const productPage = new ProductPage(page);
    await productPage.goto('57');
    await productPage.addToCart();

    // Assertion (what "correct" means) stays in the test, not the page object
    await expect(productPage.cartTotal).not.toHaveText('$0.00');
  });

  test('Scenario 3 (negative): invalid login is rejected', async ({ page }) => {
    await page.goto('/index.php?rt=account/login');

    await page.locator('#loginFrm_loginname').fill('not_a_real_user@example.com');
    await page.locator('#loginFrm_password').fill('wrong-password-123');
    await page.getByRole('button', { name: 'Login' }).click();

    // ASSUMPTION, unverified: the URL should still show the login page,
    // not an account dashboard - this is exactly what Phase 4 will confirm or break
    await expect(page).toHaveURL(/rt=account\/login/);
  });
});
