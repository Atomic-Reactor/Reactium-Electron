const { app, BrowserWindow } = require('electron');
const cmd = require('node-cmd');

let main;
let splash;
let reactium;
let port = Number(process.env.APP_PORT || 3000);

const createMainWindow = () => {

    // Create the browser window.
    main = new BrowserWindow({
        minWidth  : 1024,
        minHeight : 768,
        width     : 1024,
        height    : 768,
        show      : false,
    });

    main.once('ready-to-show', () => {
        main.show();
        splash.close();
    });

    // Emitted when the window is closed.
    main.on('closed', () => {
        main = null;
    });

    // and load the main page of the app.
    main.loadURL(`http://localhost:${port}/demo/redux`);
}

const createSplashWindow = () => {
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

    splash.loadURL(`file://${__dirname}/public/splash.html`);

    serve();
}

const serve = () => {
    if (reactium) {
        createMainWindow();
    } else {
        reactium = cmd.run(`cross-env APP_PORT=${port} gulp local:ssr`);
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
