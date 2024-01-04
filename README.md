## OpenFin testing with Puppeteer

An example project for testing an OpenFin application with [Puppeteer](https://pptr.dev/). This should work across Windows, Mac, and Linux and is also compatible with execution on [Testable](https://testable.io).

### Prerequisites to run locally

1. Install the latest Node.js and npm
2. `git clone` this repository and change into the directory
3. Run `npm install` to install all dependencies.
4. For Mac/Linux, install openfin-cli: `npm install -g openfin-cli`.

### Running locally

From the project directory run: `./node_modules/.bin/mocha --timeout 60000 test.local.js`

And that's it. The test will launch openfin as the chromium instance and run all tests found in the `test.js` spec.

### Running on Testable

To run this on Testable simply zip up this directory and upload it into a Puppeteer Testable scenario, or connect it via a VCS link.
Testable takes care of launching OpenFin for you as part of launching Puppeteer by passing the `channel: 'openfin:[app-config-file]'` argument (e.g. `{ channel: 'openfin:app_sample.json' }`).

See `test.testable.js` for the Testable example.