import {
  test,
  expect,
} from "../docs-site/node_modules/@playwright/test/index.mjs";
async function targetExists(page) {
  await expect
    .poll(() =>
      page.evaluate(() => {
        const id = decodeURIComponent(location.hash.slice(1));
        return !!id && !!document.getElementById(id);
      }),
    )
    .toBe(true);
}
for (const suffix of [".html", "", "/", "/index.html"])
  test("502 notification " + (suffix || "extensionless"), async ({ page }) => {
    await page.goto(
      "/docs/troubleshooting" +
        suffix +
        "#successful-deploy-but-502-bad-gateway-error",
    );
    await targetExists(page);
    const target = page.locator(
      '[id="successful-deploy-but-502-bad-gateway-error"]',
    );
    await expect(target).toBeAttached();
    await expect(
      target.locator("xpath=following-sibling::h2[1]"),
    ).toContainText("HTTP 502");
    await expect
      .poll(() =>
        target.evaluate((el) => Math.abs(el.getBoundingClientRect().top) < 200),
      )
      .toBe(true);
  });
test("removed GitHub alternative uses preserved archive section and query", async ({
  page,
}) => {
  await page.goto(
    "/docs/ci-cd-integration/deploy-from-github.html?utm_source=old-docs#alternative-method-more-efficient",
  );
  await expect(page).toHaveURL(
    /\/docs-legacy\/ci-cd-integration\/deploy-from-github\?utm_source=old-docs#alternative-method-more-efficient$/,
  );
  await targetExists(page);
  await expect(
    page.locator('[id="alternative-method-more-efficient"]'),
  ).toContainText("Alternative");
});
test("preview source section and changed subsection", async ({ page }) => {
  await page.goto("/docs-next/installation/digitalocean.html");
  await expect(page).toHaveURL(
    /\/docs\/installation#source-installation-digitalocean$/,
  );
  await targetExists(page);
  await page.goto("/docs-next/get-started.html#4-dns");
  await expect(page).toHaveURL(/\/docs\/get-started#dns$/);
  await targetExists(page);
});
test("Spanish legacy and Chinese locale alias prefer translations", async ({
  page,
}) => {
  await page.goto("/es-ES/docs/deployment-methods.html");
  await expect(page).toHaveURL(/\/es-ES\/docs\/deployments$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "es-ES");
  await page.goto("/docs/zh-CN/deployment-methods.html");
  await expect(page).toHaveURL(/\/zh-CN\/docs\/deployments$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
});
test("localized historical fragments retain archive and encoded IDs", async ({
  page,
}) => {
  await page.goto(
    "/es-ES/docs/troubleshooting.html?utm_source=old-docs#c%C3%B3mo-reiniciar-caprover",
  );
  await expect(page).toHaveURL(
    /\/es-ES\/docs-legacy\/troubleshooting\?utm_source=old-docs#/,
  );
  await targetExists(page);
  await page.goto(
    "/zh-CN/docs/troubleshooting#%E9%87%8D%E7%BD%AE%E5%AF%86%E7%A0%81",
  );
  await expect(page).toHaveURL(/\/zh-CN\/docs-legacy\/troubleshooting#/);
  await targetExists(page);
});
test("saved locale cannot hijack explicit localized or English section links", async ({
  browser,
}) => {
  const context = await browser.newContext({ locale: "zh-CN" });
  await context.addInitScript(() =>
    localStorage.setItem("caprover.locale", "zh-CN"),
  );
  const page = await context.newPage();
  await page.goto("/es-ES/docs/deployment-methods.html");
  await expect(page).toHaveURL(/\/es-ES\/docs\/deployments$/);
  await page.goto(
    "/docs/troubleshooting#successful-deploy-but-502-bad-gateway-error",
  );
  await expect(page).toHaveURL(
    /\/docs\/troubleshooting#successful-deploy-but-502-bad-gateway-error$/,
  );
  await targetExists(page);
  await context.close();
});
test("initial load, hash changes, and browser history preserve current/old anchors", async ({
  page,
}) => {
  await page.goto("/docs/troubleshooting#app-unavailable-or-http-502");
  await page.waitForFunction(
    () => document.documentElement.dataset.hasHydrated === "true",
  );
  await targetExists(page);
  await page.evaluate(() => (location.hash = "how-to-restart-caprover"));
  await expect(page).toHaveURL(
    /\/docs-legacy\/troubleshooting#how-to-restart-caprover$/,
  );
  await targetExists(page);
  await page.goto("/docs/one-click-apps#installation");
  await targetExists(page);
  await page.goBack();
  await targetExists(page);
  await page.goForward();
  await expect(page).toHaveURL(/\/docs\/one-click-apps#installation$/);
});
test("Docusaurus client navigation invokes historical compatibility handler", async ({
  page,
}) => {
  await page.goto("/docs/get-started");
  await page.waitForFunction(
    () => document.documentElement.dataset.hasHydrated === "true",
  );
  // Simulate a historical Link destination through the real SPA history push.
  // pushState emits no hashchange/popstate; only the Docusaurus route hook can handle it.
  await page.evaluate(() => {
    const push = history.pushState.bind(history);
    history.pushState = (state, title, url) =>
      push(
        state,
        title,
        url === "/docs/troubleshooting"
          ? url + "#how-to-restart-caprover"
          : url,
      );
  });
  await page.locator('a[href="/docs/troubleshooting"]').first().click();
  await expect(page).toHaveURL(
    /\/docs-legacy\/troubleshooting#how-to-restart-caprover$/,
  );
  await targetExists(page);
});
test("unknown fragments remain distinguishable from confirmed mappings", async ({
  page,
}) => {
  await page.goto("/docs/deployment-methods.html#unknown-historical-heading");
  await expect(page).toHaveURL(
    /\/docs\/deployments#unknown-historical-heading$/,
  );
});
test("JavaScript-free redirect fallback and canonical 502 alias", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/es-ES/docs/deployment-methods.html");
  await expect(page).toHaveURL(/\/es-ES\/docs\/deployments$/);
  await page.goto("/docs-next/installation/digitalocean.html");
  await expect(page).toHaveURL(
    /\/docs\/installation#source-installation-digitalocean$/,
  );
  await targetExists(page);
  await page.goto(
    "/docs/troubleshooting.html#successful-deploy-but-502-bad-gateway-error",
  );
  await targetExists(page);
  await context.close();
});

for (const [category, source, finalPath, heading] of [
  [
    "installation",
    "/docs/get-started.html#step-2-connect-root-domain",
    "/docs/get-started",
    "DNS",
  ],
  [
    "app configuration",
    "/docs/app-configuration.html#persistent-directories",
    "/docs/data-persistence",
    "Persistent directories",
  ],
  [
    "persistent apps",
    "/docs/persistent-apps.html#persistent-apps",
    "/docs/data-persistence",
    "When to use persistence",
  ],
  [
    "Docker Compose",
    "/docs/docker-compose.html#supported-fields",
    "/docs/deployments/other/docker-compose",
    "Docker Compose Support Matrix",
  ],
  [
    "one-click apps",
    "/docs/one-click-apps.html#configuration-settings",
    "/docs/one-click-apps",
    "Configuration",
  ],
  [
    "NGINX",
    "/docs/nginx-customization.html#custom-files-and-directories",
    "/docs-legacy/nginx-customization",
    "Custom files and directories",
  ],
  [
    "backup",
    "/docs/backup-and-restore.html#automating-backup-process",
    "/docs/server/backup",
    "Automate Backups",
  ],
  [
    "multi-node",
    "/docs/app-scaling-and-cluster.html#run-multiple-servers",
    "/docs-legacy/app-scaling-and-cluster",
    "Run Multiple Servers",
  ],
  [
    "removed troubleshooting",
    "/docs/troubleshooting.html#reset-password",
    "/docs-legacy/troubleshooting",
    "Reset Password",
  ],
  [
    "historical OpenStack",
    "/docs/server-purchase/openstack.html#deploy-the-openstack-heat-template-file",
    "/docs-legacy/server-purchase/openstack",
    "Deploy the OpenStack Heat template file",
  ],
])
  test("category review: " + category, async ({ page }) => {
    await page.goto(source);
    await expect.poll(() => new URL(page.url()).pathname).toBe(finalPath);
    await targetExists(page);
    const text = await page.evaluate(() => {
      let element = document.getElementById(
        decodeURIComponent(location.hash.slice(1)),
      );
      while (element && !/^H[1-6]$/.test(element.tagName))
        element = element.nextElementSibling;
      return element?.textContent ?? "";
    });
    expect(text.toLowerCase()).toContain(heading.toLowerCase());
  });
