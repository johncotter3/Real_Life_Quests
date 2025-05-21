// Minimal webpack config for Expo web builds
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function(env, argv) {
  // Get the default config
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Return the final configuration
  return config;
};
