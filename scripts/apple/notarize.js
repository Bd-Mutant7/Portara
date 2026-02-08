// See https://www.youtube.com/watch?v=4IEaa0ukE1s for reference

const { notarize } = require("electron-notarize");

const config = require("./config");


/**
 *
 * @param {string} appPath
 * @returns {Promise<void>}
 */
async function notarizeApp (appPath) {
	await notarize({
		appPath,
		appBundleId: config.appBundleId,
		appleId: config.appleId,
		appleIdPassword: config.appleIdPassword,
		teamId: config.teamId,
		tool: "notarytool",
	});
}

module.exports = {
	notarizeApp,
};