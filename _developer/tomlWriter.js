import toml from "@iarna/toml";
import "dotenv/config";
import fs from "fs";

/**
 * @typedef { import("@/_developer/types/toml.js").AppConfig} Config
 */

/** @type {Config} */
let config = {};

// Globals
config.name = process.env.APP_NAME;
config.handle = process.env.APP_HANDLE;
config.client_id = process.env.SHOPIFY_API_KEY;
config.application_url = process.env.SHOPIFY_APP_URL;
config.embedded = true;

// Auth
config.auth = {};
config.auth.redirect_urls = [
  `${process.env.SHOPIFY_APP_URL}/api/auth/tokens`,
  `${process.env.SHOPIFY_APP_URL}/api/auth/callback`,
];
//Scopes
config.access_scopes = {};
config.access_scopes.scopes = process.env.SHOPIFY_API_SCOPES;
config.access_scopes.use_legacy_install_flow = false;

// Webhook event version to always match the app API version
config.webhooks = {};
config.webhooks.api_version = process.env.SHOPIFY_API_VERSION;

// GDPR URLs
config.webhooks.privacy_compliance = {};
config.webhooks.privacy_compliance.customer_data_request_url = `${process.env.SHOPIFY_APP_URL}/api/gdpr/customers_data_request`;
config.webhooks.privacy_compliance.customer_deletion_url = `${process.env.SHOPIFY_APP_URL}/api/gdpr/customers_redact`;
config.webhooks.privacy_compliance.shop_deletion_url = `${process.env.SHOPIFY_APP_URL}/api/gdpr/shop_redact`;

// App Proxy
if (
  process.env.APP_PROXY_PREFIX?.length > 1 &&
  process.env.APP_PROXY_SUBPATH?.length > 1
) {
  config.app_proxy = {};
  config.app_proxy.url = `${process.env.SHOPIFY_APP_URL}/api/proxy_route`;
  config.app_proxy.prefix = "app_prefix";
  config.app_proxy.subpath = "apps";
}

// PoS
if (process.env.POS_EMBEDDED?.length > 1) {
  config.pos = {};
  config.pos.embedded = process.env.POS_EMBEDDED === "true";
}

//Build
config.build = {};
config.build.include_config_on_deploy = true;

//Write to toml

let str = toml.stringify(config);
str = "# Avoid writing to toml directly. Use your .env file instead\n\n" + str;

fs.writeFileSync(`${process.cwd()}/shopify.app.toml`, str, (err) => {
  if (err) {
    console.log("An error occured while writing to file", e);
    return;
  }

  console.log("Written toml");
  return;
});
