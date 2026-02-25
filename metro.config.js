const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Don't use .mjs files - force CommonJS
config.resolver.sourceExts = ['js', 'jsx', 'json', 'ts', 'tsx'];

module.exports = config;
