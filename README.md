## Overview

This app scans for processes based on the network ports currently in use. The primary use case for me is to be able to easily scan for and terminate stray processes using development ports I need.

For instance, port 8080 is a port commonly used for development. So if it's in use, I can easily scan for that port with this app and terminate whatever process is using that port.

Built on top of [Svelte Electron Boilerplate](https://github.com/ptkdev-boilerplate/svelte-electron-boilerplate).

### App Screenshots

![app](docs/images/app-screenshot.png)

![stop process dialog](docs/images/process-stop-prompt.png)

![terminate process dialog](docs/images/process-terminate-prompt.png)


## Running the App
There are pre-built binaries in the [Releases](https://github.com/henryjw/port-scanner-app/releases) section. Otherwise, run the `build` script for your platform.

### Build Scripts
- MacOS 	- `npm run build-mac`
- Windows 	- `npm run build-win`
- Linux 	- `npm run build-lnx`


### Release scripts
- MacOS (builds and signs macOS app) - `npm run release-mac-x64` | `npm run release-mac-arm64`

## WSL Support
The Windows version can also scan for WSL processes. However, this functionality depends on `lsof`.
If it's not installed, then you'll get an error dialog that will tell you to install it.

Optionally, you can just disable checking for WSL processes on the app.

## Development

### Installing dependencies

```sh
npm i
```

### Dev Environment

Start the app in the `dev` environment. This starts the renderer process in [**hot-module-replacement**](https://webpack.js.org/guides/hmr-react/) mode and starts a webpack dev server that sends hot updates to the renderer process:

```sh
npm dev
```

If you don't see anything in the window, press Cmd + R (Control + R on Windows) to reload the page. This happens when the Electron app launches before the web app. Give it a few seconds; you should see the "Your application is ready~! 🚀" message in the terminal.

## Known Issues
- App shows an error alert when after trying to terminate a WSL process even after successfully terminating the process.
  - If you click the SCAN button and the process disappears from the list, then it was terminated.
- Processes running within WSL v1 will not show up
