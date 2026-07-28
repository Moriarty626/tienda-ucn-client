import { test, expect } from "@playwright/test";

test.describe("Flujo de carrito y checkout", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill(
      'input[type="email"]',
      process.env.TEST_EMAIL ?? "admin@tiendaucn.cl"
    );
    await page.fill(
      'input[type="password"]',
      process.env.TEST_PASSWORD ?? "Admin1234!"
    );
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/", { timeout: 8000 });
  });

  test("agregar producto al carrito muestra toast", async ({ page }) => {
    await page.waitForSelector("button:has-text('Agregar al carrito')", {
      timeout: 8000,
    });
    await page.locator("button:has-text('Agregar al carrito')").first().click();
    await expect(page.locator("[data-sonner-toast]")).toBeVisible({
      timeout: 5000,
    });
  });

  test("modificar cantidad en carrito actualiza el total", async ({ page }) => {
    await page.waitForSelector("button:has-text('Agregar al carrito')", {
      timeout: 8000,
    });
    await page.locator("button:has-text('Agregar al carrito')").first().click();
    await page.goto("/carrito");

    const totalBefore = await page
      .locator("text=Total")
      .locator("..")
      .locator("span")
      .last()
      .textContent();

    await page.locator("button").filter({ hasText: "+" }).first().click();

    const totalAfter = await page
      .locator("text=Total")
      .locator("..")
      .locator("span")
      .last()
      .textContent();

    expect(totalBefore).not.toBe(totalAfter);
  });

  test("checkout exitoso redirige al catalogo", async ({ page }) => {
    await page.waitForSelector("button:has-text('Agregar al carrito')", {
      timeout: 8000,
    });
    await page.locator("button:has-text('Agregar al carrito')").first().click();
    await page.goto("/carrito");
    await page.click("button:has-text('Confirmar pedido')");
    await expect(page).toHaveURL("/", { timeout: 10000 });
  });
});
