# Portara 🔍

[![Support](https://img.shields.io/badge/Support-Paystack-00C3F7?style=for-the-badge&logo=paypal&logoColor=white)](https://paystack.shop/pay/bd-mutant7)


## 📋Overview 

Portara scans for processes based on the network ports currently in use. The primary use case is to be able to easily scan for and terminate stray processes using development ports you need.

For instance, port 8080 is a port commonly used for development. So if it's in use, you can easily scan for that port with Portara and terminate whatever process is using that port.

Built on top of [Svelte Electron Boilerplate](https://github.com/ptkdev-boilerplate/svelte-electron-boilerplate).

## 🚀Running the App 
There are pre-built binaries in the [Releases](https://github.com/Bd-Mutant7/Portara/releases) section. Otherwise, run the `build` script for your platform.

### 🔧Build Scripts
- MacOS 	- `npm run build-mac`
- Windows 	- `npm run build-win`
- Linux 	- `npm run build-lnx`

## 🔧 One-Line Setup (Windows)
```bash
git clone https://github.com/Bd-Mutant7/Portara.git
cd Portara
npm install
npm run dev
```
## 💻 Platform-Specific Builds
### 🪟 Windows
```bash
# Development mode
npm run dev

# Build standalone executable
npm run build-win

# Build 32-bit version
npm run build-win-32bit
```
### 🍏 macOS
```bash
# Development mode
npm run dev

# Build for Intel (x64)
npm run build-mac-x64

# Build for Apple Silicon (M1/M2/arm64)
npm run build-mac-arm64

# Build and sign for distribution
npm run release-mac-x64  # or release-mac-arm64
```
### 🐧 Linux
```bash
# Development mode
npm run dev

# Build (AppImage, deb, rpm)
npm run build-lnx
```
### 📂 Output Location
```text
Portara/build/
```
Windows: 
```sh 
Portara-win32-x64/ or Portara Setup *.exe
```
macOS: 
```sh
Portara-dmg-x64/ or Portara-dmg-arm64/ with .dmg file
```
Linux: 
```sh
Portara-linux-x64/ with .AppImage, .deb, .rpm
```
## ⚡ Quick Start (After Install)
```bash
# 1. Clone
git clone https://github.com/Bd-Mutant7/Portara.git

# 2. Enter directory
cd Portara

# 3. Install dependencies
npm install

# 4. Launch dev version
npm run dev
```
The app should open immediately! 🚀

### 📦Release scripts
- MacOS (builds and signs macOS app) - `npm run release-mac-x64` | `npm run release-mac-arm64`

## 🪟WSL Support
The Windows version can also scan for WSL processes. However, this functionality depends on `lsof`.
If it's not installed, then you'll get an error dialog from Portara that will tell you to install it.

Optionally, you can just disable checking for WSL processes in the app.

## 💻Development

### 📥Installing dependencies ⚡

```sh
npm i
```
## 🛠️Dev Environment 
Start the app in the dev environment. This starts the renderer process in ####hot-module-replacement mode and starts a webpack dev server that sends hot updates to the renderer process:
```sh
npm dev
```
If you don't see anything in the window, press Cmd + R (Control + R on Windows) to reload the page. This happens when the Electron app launches before the web app. Give it a few seconds; you should see the "Your application is ready~! 🚀" message in the terminal.

## ⚠️Known Issues
App shows an error alert when trying to terminate a WSL process even after successfully terminating the process.

If you click the SCAN button and the process disappears from the list, then it was terminated.

Processes running within WSL v1 will not show up

## Links

[![Hypercommit](https://img.shields.io/badge/Hypercommit-DB2475)](https://hypercommit.com/portara)
