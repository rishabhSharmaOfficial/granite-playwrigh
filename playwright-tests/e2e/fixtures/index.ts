// fixtures/index.ts

import { test as base } from "@playwright/test";
import LoginPage from "../poms/login";
import { TaskPage } from "../poms/tasks";

interface ExtendedFixtures {
  loginPage: LoginPage;
  taskPage: TaskPage;
}

export const test = base.extend<ExtendedFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  taskPage: async ({ page }, use) => {
    const taskPage = new TaskPage(page);
    await use(taskPage);
  },
});
