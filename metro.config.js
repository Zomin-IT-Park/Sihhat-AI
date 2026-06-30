const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    unstable_enablePackageExports: true,
    unstable_conditionNames: ['react-native', 'require', 'default'],
  },
};

module.exports = mergeConfig(defaultConfig, config);
