import { test, expect, type Page } from "@playwright/test";

async function fullTest(page: Page, url: string, email: string) {
  await page.goto(url);
  await expect(page).toHaveTitle("Remix + Firebase");
  await page.getByPlaceholder("you@example.com").fill("user@example.com");
  await page.getByPlaceholder("password").fill("password");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(
    page.getByRole("heading", { name: "Hello Example User!" })
  ).toBeVisible();
  await page.getByPlaceholder("Get Milk").fill("Write tests");
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByText("Write tests")).toBeVisible();
  await page.getByRole("button", { name: "Delete" }).click();
  await expect(page.getByText("Write tests")).not.toBeVisible();
  await page.getByPlaceholder("Get Milk").fill("Write more tests");
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByText("Write more tests")).toBeVisible();
  await page.getByRole("link", { name: "log out" }).click();
  await page.getByRole("button", { name: "Logout" }).click();
  await expect(
    page.getByRole("heading", { name: "Hello Example User!" })
  ).not.toBeVisible();
  await page.getByRole("link", { name: "join" }).click();
  await expect(page).toHaveURL(/.*join/);
  await page.getByPlaceholder("Peter").fill("Bob");
  await page.getByPlaceholder("you@example").fill(email);
  await page.getByPlaceholder("password").fill("password");
  await page.getByRole("button", { name: "Join" }).click();
  await expect(page.getByRole("heading", { name: "Hello Bob!" })).toBeVisible();
  await expect(page.getByText("Write more tests")).not.toBeVisible();
  await page.getByPlaceholder("Get Milk").fill("Test multiple users");
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByText("Test multiple users")).toBeVisible();
  await page.getByRole("link", { name: "log out" }).click();
  await page.getByRole("button", { name: "Logout" }).click();
  await page.getByPlaceholder("you@example.com").fill("user@example.com");
  await page.getByPlaceholder("password").fill("password");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(
    page.getByRole("heading", { name: "Hello Example User!" })
  ).toBeVisible();
  await expect(page.getByText("Write more tests")).toBeVisible();
  await expect(page.getByText("Test multiple users")).not.toBeVisible();
  await page.getByRole("button", { name: "Delete" }).click();
  await expect(page.getByText("Write more tests")).not.toBeVisible();
}

test("all the things", async ({ page, browser }) => {
  // Test on Firebase and GCF, with and without JavaScript
  await fullTest(page, "http://127.0.0.1:5002/", "bob@example.com");
  // Assets aren't loaded on GCF, as it is not intended to serve static assets
  // This test simulates that when JS is enabled, but fails to load, ensuring everything is still ok and the adapter works on GCF
  await fullTest(
    await browser.newPage(),
    "http://127.0.0.1:5003/",
    "bob2@example.com"
  );
  await fullTest(
    await browser.newPage({
      javaScriptEnabled: false,
    }),
    "http://127.0.0.1:5002/",
    "bob3@example.com"
  );
  await fullTest(
    await browser.newPage({
      javaScriptEnabled: false,
    }),
    "http://127.0.0.1:5003/",
    "bob4@example.com"
  );
});
