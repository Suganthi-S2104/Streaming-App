const fs = require("fs");
const allure = require("allure-commandline");

exports.config = {
  runner: "local",

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
            "--headless",
            "--allow-running-insecure-content",
            "--disable-blink-features=AutomationControlled",
            "--no-sandbox",
          ],
          excludeSwitches: ["enable-automation"],
        },
      
    },
  ],
  //baseUrl: "http://localhost",

  logLevel: "error", 
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 1,

  services: [],

  framework: "mocha",

  reporters: [
    [
      "allure",
      {
        outputDir: "allure-results",
        disableWebdriverStepsReporting: true,  // API = no steps
        disableWebdriverScreenshotsReporting: true, // no screenshots
      },
    ],
  ],

  mochaOpts: {
    ui: "bdd",
    timeout: 30000,
  },

  // Clean the allure folder before starting
  onPrepare: function () {
    const dir = "./allure-results";
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true });
    }
  },

  // Optional: Called before any test starts
  beforeTest: function () {
    console.log("Starting API test...");
  },

  // Allure report generation after the run
  onComplete: function () {
    const generation = allure(["generate", "allure-results", "--clean"]);
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error("Allure report generation timed out")), 10000);
      generation.on("exit", function (exitCode) {
        clearTimeout(timeout);
        if (exitCode !== 0) {
          return reject(new Error("Allure report generation failed"));
        }
        console.log("Allure report successfully generated.");
        resolve();
      });
    });
  },
};
