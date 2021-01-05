## OpenFin testing with Puppeteer

An example project for testing an OpenFin application with [Puppeteer](https://pptr.dev/). This should work across Windows, Mac, and Linx and is also compatible with execution on [Testable](https://testable.io).

### Prerequisites to run locally

1. Install the latest Node.js and npm
2. `git clone` this repository and change into the directory
3. Run `npm install` to install all dependencies.
4. For Mac/Linux, install the Testable fork of openfin-cli that makes sure the devtools port works correctly: `npm install -g testable-openfin-cli`.

### Running locally

From the project directory run: `./node_modules/.bin/mocha --timeout 60000 test.js`

And that's it. The test will launch openfin as the chromium instance and run all tests found in the `test.js` spec.

### Running on Testable

To run this on Testable simply zip up this directory and upload it into a Puppeteer Testable scenario, or connect it via a VCS link.