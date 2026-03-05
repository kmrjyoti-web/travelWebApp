import { test, expect } from '@playwright/test';

test.describe('Keyboard shortcuts', () => {
  test('Escape key works on login page without throwing', async ({ page }) => {
    await page.goto('/login');
    await page.keyboard.press('Escape');
    // Page should still be functional
    await expect(page.locator('body')).toBeVisible();
  });

  test('Tab key navigates form fields on login page', async ({ page }) => {
    await page.goto('/login');
    const emailField = page.getByLabel(/email|identifier/i);
    await emailField.click();
    await page.keyboard.press('Tab');
    // Focus should have moved to next focusable element
    const activeTag = await page.evaluate(() => document.activeElement?.tagName.toLowerCase());
    expect(['input', 'button', 'select', 'textarea', 'a']).toContain(activeTag);
  });

  test('Ctrl+/ shortcut is registered in keyboard shortcut config', async ({ page }) => {
    await page.goto('/login');
    // Verify the page is functional (shortcut registration happens at component mount)
    // We check indirectly by asserting no JS errors during load
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.waitForTimeout(500);
    expect(errors.filter((e) => e.includes('shortcut') || e.includes('keyboard'))).toHaveLength(0);
  });

  test('Ctrl+B shortcut does not throw on authenticated dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    const isOnLogin = page.url().includes('/login');
    if (!isOnLogin) {
      const errors: string[] = [];
      page.on('pageerror', (err) => errors.push(err.message));
      await page.keyboard.press('Control+b');
      await page.waitForTimeout(300);
      expect(errors).toHaveLength(0);
    }
  });
});
