const dotenv = require("dotenv");
dotenv.config();

const missingVariables = [];


/**
 *
 * @param {string} envVariableName
 * @param required
 * @returns {string}
 */
const env = (envVariableName, required = true) => {
	const value =  process.env[envVariableName] || "";

	if (!value && required) {
		missingVariables.push(envVariableName);
	}

	return value;
};

if (missingVariables.length > 0) {
	throw new Error(`ERROR: Missing environment variables: \n${missingVariables.join("\n")}`);
}

const config =  {
	appBundleId: env("APPLE_BUNDLE_ID"),
	appPaths: env("APPLE_APP_PATHS").split(";"),
	appleId: env("APPLE_ID"),
	appleIdPassword: env("APPLE_ID_PASSWORD"),
	teamId: env("APPLE_TEAM_ID")
};

module.exports = config;