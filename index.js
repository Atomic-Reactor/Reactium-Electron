const { app, BrowserWindow } = require('electron');
const cmd = require('node-cmd');
const fs = require('fs');

let main;
let splash;
let reactium;

let ssrMode = process.env.SSR_MODE || 'off';
let port    = Number(process.env.APP_PORT || 8000);
let width   = Number(process.env.WIN_WIDTH || 1024);
let height  = Number(process.env.WIN_HEIGHT || 768);


const createMainWindow = () => {

    // Create the browser window.
    main = new BrowserWindow({
        minWidth  : width,
        minHeight : height,
        width     : width,
        height    : height,
        show      : false,
    });

    main.once('ready-to-show', () => {
        main.show();
        if (splash) { splash.close(); }
    });

    // Emitted when the window is closed.
    main.on('closed', () => {
        main = null;
    });

    // and load the main page of the app.
    main.loadURL(`http://localhost:${port}/demo/redux`);
}

const createSplashWindow = () => {
    let splashFile = `${process.cwd()}/public/splash.html`;

    if (fs.existsSync(splashFile)) {

        splash = new BrowserWindow({
            width     : 640,
            height    : 480,
            frame     : false,
        });

        splash.on('closed', () => {
            splash = null;
        });

        splash.once('ready-to-show', () => {
            splash.show();
        });

        splash.loadURL(`file://${splashFile}`);
    }

    serve();
}

const serve = () => {
    if (reactium) {
        createMainWindow();
    } else {
        let ssr = (String(ssrMode).toLowerCase() === 'on') ? ':ssr' : '';
        reactium = cmd.run(`cross-env APP_PORT=${port} gulp local${ssr}`);
        reactium.stdout.on('data', (data) => {
            if (data.match(/ui external/i)) {
                if (!main) { createMainWindow(); }
            }
        });
    }
}

app.on('ready', createSplashWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (main === null) { createMainWindow(); }
});
