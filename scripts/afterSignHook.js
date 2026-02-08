const path = require('path');
const { notarizeApp } = require('./apple/notarize');

/**
 *
 * @param {import('./types/Params')/.AfterSignHookParams} params
 * @returns {Promise<void>}
 */
async function afterSignHook(params) {
	if (params.electronPlatformName !== 'darwin') {
		return;
	}

	if (process.env.NOTARIZE !== 'true') {
		console.info("Notarization is disabled. Set environment variable NOTARIZE=true to enable");
		return;
	}

	const { appOutDir, packager: {appInfo: {productFilename}} } = params;

	const fileExtension = path.extname(productFilename) || '.app';

	const filePath = path.join(appOutDir, productFilename + fileExtension);

	try {
		console.debug(`Notarizing ${filePath}...`);
		await notarizeApp(filePath);
		console.debug(`Notarization done for ${filePath}.`);
	} catch(err) {
		console.error("Notarization failed", err);
		throw err;
	}
}

module.exports = afterSignHook;