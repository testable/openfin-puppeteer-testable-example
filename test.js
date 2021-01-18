
const exec = require('child_process').exec;
const puppeteer = require('puppeteer-core');
const { promisify } = require('util')
const sleep = promisify(setTimeout);
const should = require('chai').should()

const IsWinOS = process.platform === 'win32';
const ConfigUrl = process.env.CONFIG_URL || (IsWinOS ? `${process.cwd()}\\app_sample.json` : `${process.cwd()}/app_sample.json`);
const RemoteDebuggingPort = process.env.CHROME_PORT || 12565;
const TimeoutMs = 60000;

async function withTimeout(op) {
    const start = Date.now();
    let result;
    while (!result && Date.now() - start < TimeoutMs) {
        try {
            result = await op();
        } catch (err) { }
        if (!result)
            await sleep(500);
    }
    return result;
}

async function findPage(title, browser) {
    return await withTimeout(async function () {
        const pages = await browser.pages();
        for (const page of pages) {
            const pageTitle = await page.title();
            if (pageTitle === title)
                return page;
        }
    });
}

function launch() {
    const proc = exec(IsWinOS ?
        `OpenFinRVM.exe --config=${ConfigUrl} --runtime-arguments="--remote-debugging-port=${RemoteDebuggingPort}"` :
        `runtimeArgs="--remote-debugging-port=${RemoteDebuggingPort}" openfin -l -c ${ConfigUrl}`);
    proc.stdout.on('data', (data) => {
        console.log(data.toString());
    });
    proc.stderr.on('data', (data) => {
        console.log(data.toString());
    });
}

async function connect() {
    return await withTimeout(async function () {
        return await puppeteer.connect({
            browserURL: `http://localhost:${RemoteDebuggingPort}`
        });
    });
}

before(async function () {
    // Launch OpenFin first
    launch();

    // Try to connect until OpenFin is up
    global.browser = await connect();
});

describe('Hello OpenFin App testing with Puppeteer', function () {
    var notificationButton, cpuInfoButton, cpuInfoExitButton;

    /**
     *  Check if OpenFin Javascript API fin.desktop.System.getVersion exists
     *
    **/
    async function waitForFinDesktop() {
        return await withTimeout(async function () {
            return await page.evaluate(function () {
                return fin && fin.desktop && fin.desktop.System && fin.desktop.System.getVersion;
            });
        });
    }

    it('Find the Hello OpenFin Main window', async () => {
        global.page = await findPage('Hello OpenFin', browser);
        await page.screenshot({ path: 'Main.png' });
    });

    it('Wait for OpenFin API ready', async () => {
        await waitForFinDesktop();
    });

    it("Find notification button", async () => {
        const result = await page.$("#desktop-notification");
        should.exist(result);
        notificationButton = result;
    });

    it("Click notification button", async () => {
        should.exist(notificationButton);
        await notificationButton.click();
    });

    it("Find CPU Info button", async () => {
        const result = await page.$("#cpu-info");
        should.exist(result);
        cpuInfoButton = result;
    });

    it("Click CPU Info button", async () => {
        should.exist(cpuInfoButton);
        await cpuInfoButton.click();
        await sleep(3000); // pause just for demo purpose so we can see the window
    });

    it('Switch to CPU Info window', async () => {
        global.page = await findPage('Hello OpenFin CPU Info', browser);
        await page.screenshot({ path: 'CPU.png' });
    });

    it("Find Exit button for CPU Info window", async () => {
        const result = await page.$("#close-app");
        should.exist(result);
        cpuInfoExitButton = result;
    });

    it("Click CPU Info Exit button", async () => {
        should.exist(cpuInfoExitButton);
        await cpuInfoExitButton.click();
    });

});

after(async () => {
    await page.evaluate(function () {
        fin.desktop.System.exit();
    });
    await sleep(1000);
});