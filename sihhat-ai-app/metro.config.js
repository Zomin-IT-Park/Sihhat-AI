const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);

// health-admin-app ushbu papka ichida joylashgan alohida (Expo) loyiha -
// o'zining node_modules'iga ega. Agar Metro shu papkani ham skanerlasa,
// ikkita react-native/react nusxasi to'qnashib, "haste module naming
// collision" yoki tushunarsiz build xatolariga olib keladi. Shuning uchun
// uni butunlay chetlab o'tamiz.
const HEALTH_ADMIN_APP = path.resolve(__dirname, 'health-admin-app');

const config = {
  resolver: {
    blockList: [
      new RegExp('^' + HEALTH_ADMIN_APP.replace(/[/\\]/g, '[/\\\\]') + '[/\\\\].*$'),
    ],
  },
};

module.exports = mergeConfig(defaultConfig, config);
