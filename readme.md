# Reactium Electron

Convert your Reactium App into a desktop app.


## Install
- Install both `electron` and `reactium-electron`:

```
$ npm install --save electron reactium-electron
```

- Update your `package.json` start script:

```
electron ./node_modules/reactium-electron/index.js
```

- Start the App:
```
$ npm start
```


### Config
You can customize the Electron app by setting the following Environment Variables:

#### SSR_MODE
Whether to run the app in SSR mode

values: `on|off`

default: `off`

#### WIN_WIDTH
The width of the BrowserWindow object.

default: `1024`

#### WIN_HEIGHT
The height of the BrowserWindow object.

default: `768`

#### APP_PORT
The port to run your app on.
> You should change the port so that it doesn't collide with other Reactium apps.

default: `3000`  - _Reactium localhost port_

-------
> Fully configured start script:
```
cross-env APP_PORT=8000 WIN_WIDTH=1920 WIN_HEIGHT=1280 SSR_MODE=on electron ./node_modules/reactium-electron/index.js
```
