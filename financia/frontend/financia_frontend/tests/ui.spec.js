// tests/ui.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Financia Web Project UI Tests', () => {
  // Before each test, navigate to the Home page.
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  // 1. Home page loads correctly and hero section is visible.
  test('Home page loads with hero section', async ({ page }) => {
    await expect(page.locator('#hero')).toBeVisible();
    await expect(page.locator('h1')).toHaveText(/Take Control of Your Finances/);
  });

  // 2. Clicking "Get Started for Free" opens the auth modal.
  test('Clicking Get Started opens auth modal', async ({ page }) => {
    await page.click('button:has-text("Get Started for Free")');
    const modal = page.locator('.animate-modal');
    await expect(modal).toBeVisible();
  });

  // 3. Auth modal default tab is "Sign Up".
  test('Auth modal default tab is Sign Up', async ({ page }) => {
    await page.click('button:has-text("Get Started for Free")');
    // Use a more specific locator to target the tab button in the modal header only.
    const signUpTab = page.locator('.auth-tabs >> button', { hasText: 'Sign Up' });
    await expect(signUpTab).toHaveClass(/border-b-2/);
  });

  // 4. Switching to Login tab shows the login form in the modal.
  test('Switching to Login tab shows login form', async ({ page }) => {
    await page.click('button:has-text("Get Started for Free")');
    await page.click('.auth-tabs >> button:has-text("Login")');
    await expect(page.locator('input[placeholder="Email"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Password"]')).toBeVisible();
  });

  // 5. Google Login button is visible in the auth modal.
  test('Google Login button is visible in auth modal', async ({ page }) => {
    await page.click('button:has-text("Get Started for Free")');
    // Assume the Google button has an accessible name including "Google"
    const googleBtn = page.getByRole('button', { name: /Google/i });
    await expect(googleBtn).toBeVisible();
  });

  // 6. "Watch Demo" button is visible on the Home page.
  test('Watch Demo button is visible on Home page', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Watch Demo/i })).toBeVisible();
  });

  // 7. When not logged in, the Navbar does not display Login/Signup buttons.
  test('Navbar does not display Login/Signup when not logged in', async ({ page }) => {
    // Since you've removed these from the Navbar for logged-out users,
    // we expect zero elements for these buttons.
    const loginButtons = page.locator('button:has-text("Login")');
    const signupButtons = page.locator('button:has-text("Signup")');
    await expect(loginButtons).toHaveCount(0);
    await expect(signupButtons).toHaveCount(0);
  });

  // 8. Clicking the Financia logo when logged in navigates to the dashboard.
  test('Clicking logo when logged in navigates to dashboard', async ({ page }) => {
    const user = { id: '123', name: 'Test User', email: 'test@example.com', profileImage: '/default-profile.png', googleId: null };
    await page.evaluate((user) => {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', 'fake-token');
    }, user);
    await page.reload();
    await page.click('img[alt="Financia Logo"]');
    await expect(page).toHaveURL(/dashboard/);
  });


  // 9. Filtering transactions by month and year updates the table.
  test('Filtering transactions by month/year updates the table', async ({ page }) => {
    const user = { id: '123', name: 'Test User', email: 'test@example.com', profileImage: '/default-profile.png', googleId: null };
    await page.evaluate((user) => {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', 'fake-token');
    }, user);
    await page.goto('http://localhost:3000/transactions');
    // Change month and year using selectors.
    await page.selectOption('select', { value: '0' }); // January
    await page.selectOption('select:nth-of-type(2)', { value: '2022' });
    await expect(page.locator('text=Oopss... you have no transactions for this month.')).toBeVisible();
  });

  // 10. Clicking "Add Income" opens the Income form modal.
  test('Clicking Add Income opens Income form modal', async ({ page }) => {
    const user = { id: '123', name: 'Test User', email: 'test@example.com', profileImage: '/default-profile.png', googleId: null };
    await page.evaluate((user) => {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', 'fake-token');
    }, user);
    await page.goto('http://localhost:3000/transactions');
    // Use getByRole with name to target the correct button.
    await page.getByRole('button', { name: /Add Income/i }).click();
    await expect(page.getByRole('heading', { name: /Add Income/i })).toBeVisible();
  });

  // 11. Clicking "Add Expense" opens the Expense form modal.
  test('Clicking Add Expense opens Expense form modal', async ({ page }) => {
    const user = { id: '123', name: 'Test User', email: 'test@example.com', profileImage: '/default-profile.png', googleId: null };
    await page.evaluate((user) => {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', 'fake-token');
    }, user);
    await page.goto('http://localhost:3000/transactions');
    await page.getByRole('button', { name: /Add Expense/i }).click();
    await expect(page.getByRole('heading', { name: /Add Expense/i })).toBeVisible();
  });
});