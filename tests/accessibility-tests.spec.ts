import { test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Sign in' }).click();
  await page.getByRole('textbox', { name: 'Enter email' }).click();
  await page.getByRole('textbox', { name: 'Enter email' }).fill('admin1@hawaii.edu');
  await page.getByRole('textbox', { name: 'Enter email' }).press('Tab');
  await page.getByRole('textbox', { name: 'Enter password' }).fill('changeme');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.goto('http://localhost:3000/auth/signout');
  await page.getByRole('button', { name: 'Yes, Sign Out' }).click();
  await page.goto('http://localhost:3000/auth/signup');
});