// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('@expo/metro-config');

/** @type {import('@expo/metro-config').MetroConfig} */
const defaultConfig = getDefaultConfig(__dirname);

// Export the configuration
module.exports = defaultConfig;
