/**
 * Smoke tests — M2a-21.
 *
 * Core user flows for the teachings portal.
 * Run with: npx playwright test
 */

import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads and shows Today's Wisdom", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("h1, blockquote")).toBeVisible();
  });

  test("has skip link for accessibility", async ({ page }) => {
    await page.goto("/en");
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeAttached();
  });

  test("shows thematic doors", async ({ page }) => {
    await page.goto("/en");
    await expect(page.getByText("Doors of Entry")).toBeVisible();
  });
});

test.describe("Search", () => {
  test("search page loads", async ({ page }) => {
    await page.goto("/en/search");
    await expect(page.getByRole("search")).toBeVisible();
  });

  test("search from URL params", async ({ page }) => {
    await page.goto("/en/search?q=God");
    // Wait for results to load
    await page.waitForSelector("[role='list']", { timeout: 10000 });
    const results = page.locator("[role='listitem']");
    await expect(results.first()).toBeVisible();
  });
});

test.describe("Books", () => {
  test("books page lists available books", async ({ page }) => {
    await page.goto("/en/books");
    await expect(page.getByRole("heading", { name: "Books" })).toBeVisible();
    await expect(page.getByText("Autobiography of a Yogi")).toBeVisible();
  });
});

test.describe("Quiet Corner", () => {
  test("loads with a reflection", async ({ page }) => {
    await page.goto("/en/quiet");
    await expect(page.getByText("The Quiet Corner")).toBeVisible();
    // Timer buttons should be visible
    await expect(page.getByText("1 min")).toBeVisible();
    await expect(page.getByText("5 min")).toBeVisible();
  });
});

test.describe("About", () => {
  test("about page loads", async ({ page }) => {
    await page.goto("/en/about");
    await expect(page.getByRole("heading", { name: "About" })).toBeVisible();
    await expect(page.getByText("Paramahansa Yogananda")).toBeVisible();
  });
});

test.describe("Navigation", () => {
  test("header navigation works", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("link", { name: "Search" }).click();
    await expect(page).toHaveURL(/\/en\/search/);
  });

  test("language switcher present", async ({ page }) => {
    await page.goto("/en");
    // Language switcher should be in the header
    await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
  });
});

test.describe("API", () => {
  test("health endpoint returns ok", async ({ request }) => {
    const response = await request.get("/api/v1/health");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.status).toBe("ok");
  });

  test("OpenAPI spec is valid JSON", async ({ request }) => {
    const response = await request.get("/api/v1/openapi.json");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.openapi).toBe("3.1.0");
  });

  test("OG image endpoint returns image", async ({ request }) => {
    const response = await request.get(
      "/api/og?text=Test+quote&author=Yogananda",
    );
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
  });
});

test.describe("Accessibility", () => {
  test("all pages have main-content landmark", async ({ page }) => {
    const pages = ["/en", "/en/search", "/en/books", "/en/about", "/en/quiet"];
    for (const url of pages) {
      await page.goto(url);
      await expect(page.locator("#main-content")).toBeVisible();
    }
  });

  test("focus indicators are visible", async ({ page }) => {
    await page.goto("/en");
    // Tab to first focusable element
    await page.keyboard.press("Tab");
    // The skip link should become visible
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeVisible();
  });
});
