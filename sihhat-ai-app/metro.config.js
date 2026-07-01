const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// health-admin-app va sihhat-ai-backend endi bu loyiha ichida emas, balki
// birodar (sibling) papkalar - sihhat-ai/health-admin-app,
// sihhat-ai/sihhat-ai-backend. Metro'ning projectRoot'i shu papka
// (sihhat-ai-app) bo'lgani uchun ular avtomatik skanerlanmaydi, alohida
// blockList kerak emas.
const config = {};

module.exports = mergeConfig(defaultConfig, config);
