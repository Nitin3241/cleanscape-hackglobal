const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Android plays the Ogg builds of the UI sounds in assets/sounds.
config.resolver.assetExts.push('ogg');

module.exports = config;
