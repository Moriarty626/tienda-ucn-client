import { test, expect } from "@playwright/test";

test.describe("Flujo de identidad", () => {
  test("login invalido muestra error", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "noexiste@test.com");
    await page.fill('input[type="password"]', "clavefalsa123");
    await page.click('button[type="submit"]');
    await expect(page.locator("li[data-sonner-toast]")).toBeVisible({
      timeout: 5000,
    });
  });

  test("login valido redirige al inicio", async ({ page }) => {
    await page.goto("/login");
    await page.fill(
      'input[type="email"]',
      process.env.TEST_EMAIL ?? "admin@test.com"
    );
    await page.fill(
      'input[type="password"]',
      process.env.TEST_PASSWORD ?? "Admin123!"
    );
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/", { timeout: 8000 });
  });
});
