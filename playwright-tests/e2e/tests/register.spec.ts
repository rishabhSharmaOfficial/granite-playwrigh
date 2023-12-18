// register.spec.js

import { test } from "../fixtures";
import { faker } from "@faker-js/faker";

test.describe("Register page", () => {
  test("should register a new user", async ({ page, loginPage }) => {
    const username = faker.person.fullName();
    const email = faker.internet.email();
    const password = faker.internet.password();

    await page.goto("http://localhost:3000/");
    await page.getByTestId("login-register-link").click();
    await page.getByTestId("signup-name-field").fill(username);
    await page.getByTestId("signup-email-field").fill(email);
    await page.getByTestId("signup-password-field").fill(password);
    await page.getByTestId("signup-password-confirmation-field").fill(password);
    await page.getByTestId("signup-submit-button").click();
    await loginPage.loginAndVerifyUser({ email, password, username });
  });
});
