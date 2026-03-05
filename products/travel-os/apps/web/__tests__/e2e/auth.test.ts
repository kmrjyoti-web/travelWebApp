import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Clear auth state before each test
    await page.context().clearCookies();
  });

  test('login page loads with correct title and form', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/TravelOS/);
    await expect(page.getByRole('heading', { name: /sign in|log in|welcome/i })).toBeVisible();
    await expect(page.getByLabel(/email|identifier/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in|log in|submit/i })).toBeVisible();
  });

  test('shows validation error on empty submit', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /sign in|log in|submit/i }).click();
    // Either inline validation or an error message appears
    const errorVisible = await page.locator('[role="alert"], .tos-field__error, [aria-invalid="true"]').first().isVisible();
    expect(errorVisible).toBe(true);
  });

  test('shows error on invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email|identifier/i).fill('invalid@test.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /sign in|log in|submit/i }).click();
    // Error message should appear (either from API or inline)
    await expect(page.locator('[role="alert"], .tos-form__error').first()).toBeVisible({ timeout: 5000 });
  });

  test('unauthenticated user is redirected to login from /dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    // Should redirect to login if not authenticated
    await expect(page).toHaveURL(/\/login/);
  });

  test('register page loads', async ({ page }) => {
    await page.goto('/register');
    await expect(page).toHaveTitle(/TravelOS/);
  });

  test('forgot password page loads', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page).toHaveTitle(/TravelOS/);
  });
});
