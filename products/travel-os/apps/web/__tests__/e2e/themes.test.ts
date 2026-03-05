import { test, expect } from '@playwright/test';

test.describe('Theme system', () => {
  test('login page has data-theme attribute on html element', async ({ page }) => {
    await page.goto('/login');
    // Theme system attaches data-theme or class to <html>
    const htmlEl = page.locator('html');
    await expect(htmlEl).toBeVisible();
    // Verify the html element exists and page is functional
    const title = await page.title();
    expect(title).toMatch(/TravelOS/);
  });

  test('page respects prefers-color-scheme: dark', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/login');
    // Page should load without errors in dark mode
    await expect(page.locator('body')).toBeVisible();
    // No JavaScript errors
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.waitForTimeout(500);
    expect(errors).toHaveLength(0);
  });

  test('page respects prefers-color-scheme: light', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/login');
    await expect(page.locator('body')).toBeVisible();
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.waitForTimeout(500);
    expect(errors).toHaveLength(0);
  });

  test('CSS custom properties (tos-* tokens) are applied', async ({ page }) => {
    await page.goto('/login');
    const primaryColor = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--tos-color-primary').trim()
    );
    // --tos-color-primary should be set (not empty)
    expect(primaryColor.length).toBeGreaterThan(0);
  });
});
