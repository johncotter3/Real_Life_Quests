// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

/** @type {import('@expo/metro-config').MetroConfig} */
const defaultConfig = getDefaultConfig(__dirname);

// Add specific file extensions for web
defaultConfig.resolver.sourceExts = [...defaultConfig.resolver.sourceExts, 'web.js', 'web.jsx', 'web.ts', 'web.tsx'];

// Add asset extensions
const assetExts = ['ttf', 'otf', 'woff', 'woff2'];
defaultConfig.resolver.assetExts = [...defaultConfig.resolver.assetExts, ...assetExts];

// Export the configuration
module.exports = defaultConfig;
