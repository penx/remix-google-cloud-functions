import { test, expect } from "@playwright/test";

test("all the things", async ({ page }) => {
  await page.goto("http://127.0.0.1:5002/");
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
  await page.getByPlaceholder("you@example").fill("bob@example.com");
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
});
