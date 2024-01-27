import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

// Annotate entire file as serial.
test.describe.configure({ mode: 'serial' });

test.describe('Opening FSG', () => {
    // Declare page outside of the test hooks so it's accessible by all tests.
    let page: Page;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage(); // Create a new page
        await page.goto('https://fairsite-e9f7e.web.app/home'); // Go to FSG page
    });

    test.afterAll(async () => {
        await page.close(); // Close the page after all tests
    });

    test('Checking Title', async () => {
        // Check the title of the page
        const pageTitle = await page.title();
        await expect(pageTitle).toBe('Vite + React + TS');
    });

    test.describe('Login', () => {
        test('Login', async () => {
            // Click the Login button
            await page.click('text=Login');
            // Fill in the email and password fields
            await page.locator('#email').fill('fsgfounder@fsg.com');
            await page.locator('#password').fill('1qwe@123');
            // Click on the login button
            await page.click('.MuiButton-containedPrimary[type="submit"]');
        });

        test('Validate the home page after successful login', async () => {
            // Wait for 3 seconds
            await page.waitForTimeout(3000);
            // Wait for the page to load completely
            await page.waitForLoadState('load');
            // Validate that the current URL matches the expected URL
            const currentURL = page.url();
            await expect(currentURL).toBe('https://fairsite-e9f7e.web.app/dashboard/home');
        });
    });

    test.describe('Create Company', () => {
        test('Validate create company tab', async () => {
            const createCompanyButton = await page.waitForSelector('text=Create Company', { state: 'visible' });
            await createCompanyButton.click();
            // Validate the URL after clicking the "Create Company" button
            const currentURL = page.url();
            await expect(currentURL).toBe('https://fairsite-e9f7e.web.app/dashboard/create-company');
        });

        test('Filling new company details', async () => {
            // Fill in the company name and description fields
            await page.fill('input[name="businessName"]', 'radian scope');
            // Get the current date and time
            const timestamp = new Date().toLocaleString();
            // Fill the textarea with the message and timestamp
            await page.fill('textarea[name="description"]', `Hello, I am added by automation script at ${timestamp}`);
            // Click on the "Save and Continue" button
            await page.click('text=Save and Continue');
            await page.waitForTimeout(5000);
        });

        test('Validate company dashboard URL after creating a new company', async () => {
            // Wait for the page to load completely
            await page.waitForLoadState('load');
            // Validate the URL after creating a new company
            const currentURL = page.url();
            await expect(currentURL).toBe('https://fairsite-e9f7e.web.app/companies/radian-scope/dashboard/home');
        });
    });
});
