import { test, expect } from '@playwright/test';

test.describe('Layout switching', () => {
  test('auth layout renders on /login (no sidebar/header)', async ({ page }) => {
    await page.goto('/login');
    // Auth layout should NOT have the default header or admin header
    await expect(page.locator('[data-testid="default-header"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="admin-header"]')).not.toBeVisible();
    // Should have the auth page body
    await expect(page.locator('body')).toBeVisible();
  });

  test('auth layout renders on /register', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('[data-testid="default-header"]')).not.toBeVisible();
  });

  test('dashboard route resolves without 500 error', async ({ page }) => {
    const response = await page.goto('/dashboard');
    // Should return 200 (possibly redirect to /login, which is also fine)
    expect([200, 302, 307, 308]).toContain(response?.status());
  });

  test('users route resolves without 500 error', async ({ page }) => {
    const response = await page.goto('/users');
    expect([200, 302, 307, 308]).toContain(response?.status());
  });

  test('settings route resolves without 500 error', async ({ page }) => {
    const response = await page.goto('/settings');
    expect([200, 302, 307, 308]).toContain(response?.status());
  });

  test('health API endpoint returns 200', async ({ page }) => {
    const response = await page.goto('/api/v1/health');
    expect(response?.status()).toBe(200);
  });
});
