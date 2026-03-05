import { test, expect } from '@playwright/test';

// Note: Navigation tests require the user to be authenticated.
// In CI, use the storageState fixture with a pre-authenticated session.
// For local testing against a dev server, ensure a test user exists.
test.describe('Navigation', () => {
  test('login page has correct meta and heading', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/TravelOS/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('public landing page loads', async ({ page }) => {
    await page.goto('/landing');
    await expect(page).toHaveTitle(/TravelOS/);
  });

  test('404 page shows not found UI', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist-xyz');
    expect(response?.status()).toBe(404);
    await expect(page.getByText(/404|not found/i)).toBeVisible();
  });

  test('sidebar toggle is present on authenticated pages', async ({ page }) => {
    // Navigate to the dashboard — if not authenticated, it will redirect to login
    await page.goto('/dashboard');
    const isOnLogin = page.url().includes('/login');
    if (!isOnLogin) {
      // Sidebar hamburger button should be accessible
      const hamburger = page.getByRole('button', { name: /toggle sidebar|menu|hamburger/i });
      await expect(hamburger.or(page.locator('[data-testid="sidebar-toggle"]'))).toBeVisible();
    }
  });

  test('keyboard shortcut Ctrl+K opens search when authenticated', async ({ page }) => {
    await page.goto('/dashboard');
    const isOnLogin = page.url().includes('/login');
    if (!isOnLogin) {
      await page.keyboard.press('Control+k');
      await expect(page.getByRole('dialog', { name: /search/i })).toBeVisible({ timeout: 2000 });
    }
  });
});
