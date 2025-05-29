const Search = require('../pages/search_validation');

describe("User validation in Twicth", () => {
  before(async function () {
    await browser.url("https://m.twitch.tv/");
    await browser.waitUntil(
      async () =>
        (await browser.execute(() => document.readyState)) === "complete",
      { timeout: 10000 }
    );
  });

  it("Search for Category", async () => {
    await Search.searchCategory("StarCraft II");
    await browser.pause(3000);
  });
  it("Search for streamer in a category", async () => {
    await Search.searchChannel("StarCraft II");
    await browser.pause(3000);
  });
});
