const fs = require("fs");
const path = require("path");
const allure = require("allure-commandline");
let screenshotCounter = 1;

// Device profiles with name and screen size
const DEVICE_PROFILES = {
  iphonexr: { deviceName: "iPhone XR", width: 414, height: 896 },
  iphonese: { deviceName: "iPhone SE", width: 375, height: 667 },
  pixel2: { deviceName: "Pixel 2", width: 411, height: 731 },
};

// Set the device to use
const selectedDeviceKey = "pixel2";

// If selected device is not found, fallback to default device
let selectedDeviceConfig = DEVICE_PROFILES[selectedDeviceKey];
if (!selectedDeviceConfig) {
  console.warn(
    `Invalid DEVICE "${selectedDeviceKey}", falling back to iPhone XR`
  );
  selectedDeviceConfig = DEVICE_PROFILES["iphonexr"];
}

exports.config = {
  runner: "local",
  // Test files location
  specs: ["./test/specs/**/*.js"],
  exclude: [],
  maxInstances: 1,
  capabilities: [
    {
      browserName: "chrome",
      acceptInsecureCerts: true,
      "goog:chromeOptions": {
        args: [
          "--ignore-certificate-errors",
          "--disable-web-security",
          "--disable-extensions",
          "--start-maximized",
          "--allow-running-insecure-content",
          "--disable-blink-features=AutomationControlled",
          "--no-sandbox",
        ],
        // Mobile emulation using selected device
        mobileEmulation: {
          deviceName: selectedDeviceConfig.deviceName,
        },
        excludeSwitches: ["enable-automation"],
      },
    },
  ],

  logLevel: "silent",
  bail: 0,
  // Base URL for all tests
  baseUrl: "https://m.twitch.tv/",
  waitforTimeout: 99000,
  connectionRetryTimeout: 99000,
  connectionRetryCount: 3,
  services: ["devtools"],
  framework: "mocha",
  // Allure reporter configuration
  reporters: [
    [
      "allure",
      {
        outputDir: "allure-results",
        disableWebdriverStepsReporting: false,
        disableWebdriverScreenshotsReporting: false,
      },
    ],
  ],
  mochaOpts: {
    ui: "bdd",
    timeout: 9900000,
  },

  // Clean allure-results folder before test starts
  onPrepare: function (config, capabilities) {
    if (fs.existsSync("./allure-results")) {
      fs.rmSync("./allure-results", { recursive: true });
    }
  },

  beforeSession: function (config, capabilities) {},
  // Set window size to match selected device resolution
  before: async function (capabilities, specs) {
    const { width, height } = selectedDeviceConfig;
    await browser.setWindowSize(width, height);
  },

  beforeTest: function (test, context) {},
  // Capture a screenshot after each test
  afterTest: async function (
    test,
    context,
    { error, result, duration, passed, retries }
  ) {
    const screenshot = await browser.takeScreenshot();

    const dir = path.join(__dirname, "screenshots");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    const testName = test.title.replace(/\s+/g, "_");
    const fileName = `ScreenShot_${testName}_${screenshotCounter++}.png`;
    const filePath = path.join(dir, fileName);

    fs.writeFileSync(filePath, screenshot, "base64");
    console.log(`Screenshot saved here: ${filePath}`);
  },

  // Generate Allure report after test run completes
  onComplete: function (exitCode, config, capabilities, results) {
    const reportError = new Error("Could not generate Allure report");
    const generation = allure(["generate", "allure-results", "--clean"]);
    return new Promise((resolve, reject) => {
      const generationTimeout = setTimeout(() => reject(reportError), 5000);
      generation.on("exit", function (exitCode) {
        clearTimeout(generationTimeout);
        if (exitCode !== 0) {
          return reject(reportError);
        }
        console.log("Allure report successfully generated");
        resolve();
      });
    });
  },
};
