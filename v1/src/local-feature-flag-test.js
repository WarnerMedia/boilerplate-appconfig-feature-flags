// Set an AWS profile to use with the SDK.  Better to set at the command line.
// process.env.AWS_PROFILE = "<profile>";

const { AppConfigDataClient,
        BadRequestException,
        GetLatestConfigurationCommand,
        StartConfigurationSessionCommand } = require("@aws-sdk/client-appconfigdata");

// General Constants
const region = "us-east-1";
const appIdentifier = process.env.APP_CONFIG_APP_IDENTIFIER || "boilerplate";
const profileIdentifier = process.env.APP_CONFIG_CONFIG_PROFILE_IDENTIFIER || "boilerplate-application-int";
const envIdentifier = process.env.APP_CONFIG_ENVIRONMENT_IDENTIFIER || "int";

// General Variables
let app = this;
let existingToken;

// AppConfig client (which can be shared by different commands).
const client = new AppConfigDataClient({ region: region });

// Parameters for the command.
const startConfigurationSessionCommand = {
  ApplicationIdentifier: appIdentifier,
  ConfigurationProfileIdentifier: profileIdentifier,
  EnvironmentIdentifier: envIdentifier
};

// New instance for getting an AppConfig session token.
const getSession = new StartConfigurationSessionCommand(startConfigurationSessionCommand);

/* General Functions */

// Get AppConfig token.
async function getToken() {

  try {

    const sessionToken = await client.send(getSession);

    return sessionToken.InitialConfigurationToken || "";

  } catch (error) {

    console.error(error);

    throw error;

  } finally {

    // console.info("complete");

  }

}

// Get all feature flags for this application and environment.
function getFeatureFlags() {

  async function _asyncFeatureFlags() {

    if (!existingToken) {

      existingToken = await getToken();

    }

    try {

      // Paramaters for the command.
      const getLatestConfigurationCommand = {
        ConfigurationToken: existingToken
      };
    
      // Get the lastest configuration.
      const getConfiguration = new GetLatestConfigurationCommand(getLatestConfigurationCommand);

      // Get the configuration.
      const response = await client.send(getConfiguration);

      if (response.Configuration) {

        // The configuration comes back as as set of character codes.
        // Need to convert the character codes into a string.
        let configuration = "";

        for (let i = 0; i < response.Configuration.length; i++) {
          configuration += String.fromCharCode(response.Configuration[i]);
        }

        const allFlags = JSON.parse(configuration);

        app.flags = Object.assign({}, allFlags);

      }

    } catch (error) {

      if (error instanceof BadRequestException) {

        console.error(error);

        existingToken = await getToken();

        return _asyncFeatureFlags();

      } else {

        throw error;

      }

    } finally {

      // console.info("complete");

    }

  }

  return _asyncFeatureFlags();

}

// Get a single feature flag.
function getFeatureFlag(flag) {

  if (app.flags && flag) {

    return app.flags[flag];

  } else {

    return {};

  }

}

// Initialize the application.
function init() { 

  // Fail the initialization if the promises fail.
  function _failure(error) {

    console.error(error);
    return;

  }

  // Any promises that need to be resolved first should be done in the initialization (init) function.
  Promise.all([
    getFeatureFlags()
  ]).then(main,_failure);

}

// This is the main logic.
function main() {

  console.log("header: " + JSON.stringify(getFeatureFlag("header")));
  console.log("footer: " + JSON.stringify(app.flags.footer));
  console.log("short-term-feature: " + JSON.stringify(getFeatureFlag("short-term-feature")));

}

init();