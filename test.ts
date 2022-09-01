import { buildFor } from "sinco/mod.ts";
import { assertEquals } from "testing/asserts.ts";

const CHROME_BIN = Deno.env.get("CHROME_BIN");

Deno.test("E2E test", async (t) => {
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
  function connect(url: string): void {
    ws = new WebSocket(url, protocol); 
    ws.onopen = onOpen;
    ws.onmessage = onMessage;
    ws.onerror = onError;
    ws.onclose = onClose;
}
//indicates that the connection is ready to send and receive data

function onOpen(event: any): void {
    console.log("connected");
//$("#btnConnect").html("Connected");

    btnConnect.innerHTML = "Connected";

}
//An event listener to be called when a message is received from the server

function onMessage(event: any): void {
}
//An event listener to be called when an error occurs. This is a simple event named "error".

function onError(event: any): void {
    console.log(JSON.stringify(event.data));
}
//An event listener to be called when the WebSocket connection's readyState changes to CLOSED.

function onClose(event: any): void {
    console.log(JSON.stringify(event.data));
}
  
  

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
