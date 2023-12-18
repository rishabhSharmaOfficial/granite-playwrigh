
import { test } from "../fixtures";
import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import LoginPage from "../poms/login";
import { createCommentAndVerify } from "../utils/tasks";
import { TaskPage } from "../poms/tasks";

test.describe("Comments feature", () => {
  let taskName: string;
  let comment: string;

  test.beforeEach(() => {
    taskName = faker.word.words({ count: 5 });
    comment = faker.word.words({ count: 10 });
  });

  test("should add a new comment as a creator of task", async({page, taskPage, browser}) => {
    await page.goto("/");

    await taskPage.createTaskAndVerify({ taskName, userName: "Sam Smith" });
    await taskPage.createCommentAndVerify({page, taskName, comment});

    const newUserContext = await browser.newContext({
      storageState: { cookies: [], origins: [] },
    });
    const newUserPage = await newUserContext.newPage();
    const loginPage = new LoginPage(newUserPage);

    await newUserPage.goto("/");
    await loginPage.loginAndVerifyUser({
      email: "sam@example.com",
      password: "welcome",
      username: "Sam Smith",
    });
    await expect(newUserPage.getByTestId("tasks-pending-table")
      .getByRole('row', { name: taskName })
      .getByRole('cell').nth(3)).toHaveText("1");
    await newUserPage.close();
    await newUserContext.close();
  })

  test("should add a new comment as an assignee of a task", async({page, taskPage, browser}) => {
    await page.goto("/");

    await taskPage.createTaskAndVerify({ taskName, userName: "Sam Smith" });
    const newUserContext = await browser.newContext({
      storageState: { cookies: [], origins: [] },
    });
    const newUserPage = await newUserContext.newPage();
    const loginPage = new LoginPage(newUserPage);
    const newTaskPage = new TaskPage(newUserPage);

    await newUserPage.goto("/");
    await loginPage.loginAndVerifyUser({
      email: "sam@example.com",
      password: "welcome",
      username: "Sam Smith",
    });
    await newTaskPage.createCommentAndVerify({taskName, comment});
    await newUserPage.close();
    await newUserContext.close();

    await page.reload();
    await expect(page.getByTestId("tasks-pending-table")
      .getByRole('row', { name: taskName })
      .getByRole('cell').nth(3)).toHaveText("1");
  })
})
