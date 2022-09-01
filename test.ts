import { buildFor } from "sinco/mod.ts";
import { assertEquals } from "testing/asserts.ts";

const CHROME_BIN = Deno.env.get("CHROME_BIN");

Deno.test("E2E test", async () => {
  /* Start Sinco */
  const { browser, page } = await buildFor("chrome", {
    binaryPath: CHROME_BIN,
  });

  const index = "http://localhost:8000/";

  /* Beginning of tests */

  await t.step("click the logo", async () => {
    await page.location(index);

    const image = await page.querySelector("img");
    await image.click({ waitFor: "navigation" });

    assertEquals(await page.location(), "https://www.active-connector.com/");
  });

  await page.location(index);

  await t.step("input is empty", async () => {
    const input = await page.querySelector("input");
    assertEquals(await input.value(), "");
  });

  await t.step("error is not shown", async () => {
    const error = await page.evaluate(() =>
      document.querySelector("p")?.innerText
    );
    assertEquals(error, undefined);
  });

  await t.step("show error for an empty input", async () => {
    const button = await page.querySelector("button");
    await button.click({ waitFor: "navigation" });

    const error = await page.evaluate(() =>
      document.querySelector("p")?.innerText
    );
    assertEquals(error, "error: empty input");
  });

  await t.step("input a random string and click the button", async () => {
    const input = await page.querySelector("input");

    const name = crypto.randomUUID().slice(0, 7);
    await input.value(name);

    const button = await page.querySelector("button");
    await button.click({ waitFor: "navigation" });

    assertEquals(await page.location(), `${index}jobs/${name}`);

    const body = await page.evaluate(() => {
      return document.querySelector("div")?.innerText;
    });
    assertEquals(body, `Job "${name}" is not available`);
  });

  await page.location(index);

  await t.step("input 'engineer' and click the button", async () => {
    const input = await page.querySelector("input");
    await input.value("engineer");

    const button = await page.querySelector("button");
    await button.click({ waitFor: "navigation" });

    assertEquals(await page.location(), `${index}jobs/engineer`);

    const body = await page.evaluate(() => {
      return document.querySelector("div")?.innerText;
    });
    assertEquals(body, `Job "engineer" is open for you!`);
  });

  /* End of tests */

  await browser.close();
});
