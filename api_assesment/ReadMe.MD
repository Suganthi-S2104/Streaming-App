# WebdriverIO Test Automation Project

## Description

This project is a browser automation test suite built using [WebdriverIO](https://webdriver.io/), a robust and scalable automation framework for web applications.

It supports cross-browser testing, integration with cloud services like BrowserStack or Sauce Labs, and rich test reporting.

---

## Reporting Supported

This WDIO project supports multiple report formats:
- **Allure Reporter**: Advanced, interactive test reports  

Allure reports are generated in the `allure-results` folder and can be served locally using Allure CLI.

## Commands to Run Tests

npx wdio run wdio.conf.js

npx wdio run wdio.conf.js --spec ./test/specs/example.e2e.js

### generate and open report:

allure generate allure-results --clean
allure open

