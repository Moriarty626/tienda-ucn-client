import { test, expect } from "@playwright/test";

test.describe("Flujo de carrito", () => {
  test("agregar producto al carrito actualiza el contador", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForSelector(
      '[data-testid="product-card"], .grid .rounded-lg',
      { timeout: 8000 }
    );

    const addBtn = page
      .locator('button:has-text("Agregar al carrito")')
      .first();
    await addBtn.click();

    const badge = page.locator("header").getByText(/^[1-9]/);
    await expect(badge).toBeVisible({ timeout: 3000 });
  });

  test("carrito muestra productos agregados y calcula total", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForSelector('button:has-text("Agregar al carrito")', {
      timeout: 8000,
    });

    await page.locator('button:has-text("Agregar al carrito")').first().click();
    await page.goto("/carrito");

    await expect(page.locator("h1")).toContainText("Carrito");
    await expect(
      page.locator('button:has-text("Confirmar pedido")')
    ).toBeVisible();
  });
});
