const videoPlayer = require("./videoPlayer");

class Search {
  // Selectors for search UI elements
  get searchButton() {
    return $(`(//div[@class='Layout-sc-1xcs6mc-0 jBesbm'])[2]`);
  }
  get searchInput() {
    return $(`//div //input[@type="search"]`);
  }
  get searchCategoryResult() {
    return $(`//a //h2[@title="${this.category}"]`);
  }
  get serachSubHeaders() {
    return $$(`//ul[@role="tablist"] //li`);
  }
  get searchStreamerResult() {
    return $$(`.Layout-sc-1xcs6mc-0.ieOTqj`);
  }

  // Search for a specific category and click into it
  async searchCategory(category) {
    this.category = category;

    await this.searchButton.waitForDisplayed({ timeout: 7000 });
    expect(await this.searchButton.isDisplayed()).toBe(true);
    await this.searchButton.click();

    await this.searchInput.waitForDisplayed({ timeout: 7000 });
    expect(await this.searchInput.isDisplayed()).toBe(true);

    await this.searchInput.click();
    await this.searchInput.setValue(category);
    await browser.keys("Enter");

    await this.searchCategoryResult.scrollIntoView();

    const currentUrl = await browser.getUrl();
    await this.searchCategoryResult.click();

    // Wait until URL changes after clicking category
    await browser.waitUntil(
      async () => (await browser.getUrl()) !== currentUrl,
      {
        timeout: 7000,
        timeoutMsg: "Category screen did not load (URL unchanged)",
      }
    );
  }

  // Search for a channel and click into the 8th result
  async searchChannel(category) {
    await this.searchButton.waitForDisplayed({ timeout: 7000 });
    expect(await this.searchButton.isDisplayed()).toBe(true);
    await this.searchButton.click();

    await this.searchInput.waitForDisplayed({ timeout: 7000 });
    expect(await this.searchInput.isDisplayed()).toBe(true);

    await this.searchInput.click();
    await this.searchInput.setValue(category);
    await browser.keys("Enter");

    await this.serachSubHeaders[1].waitForDisplayed({ timeout: 7000 });
    await this.serachSubHeaders[1].click();

    await this.searchStreamerResult[7].scrollIntoView();
    const currentUrl = await browser.getUrl();
    await this.searchStreamerResult[7].click();

    // Wait until URL changes after clicking streamer
    await browser.waitUntil(
      async () => (await browser.getUrl()) !== currentUrl,
      {
        timeout: 7000,
        timeoutMsg: "Streamer screen did not load (URL unchanged)",
      }
    );

    // Wait for page to fully load
    await browser.waitUntil(
      async () =>
        (await browser.execute(() => document.readyState)) === "complete",
      { timeout: 10000 }
    );

    if ((await videoPlayer.videoPlayerContainer.isDisplayed()) == true) {
      await browser.waitUntil(
        async () => await videoPlayer.videoPlayerPause.isDisplayed(),
        {
          timeout: 12000,
          timeoutMsg: "Video is not played yet",
        }
      );
    }
  }
}

module.exports = new Search();
