const path = require('node:path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const edsMobileRoot = path.resolve(projectRoot, '../eds-mobile');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [edsMobileRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(edsMobileRoot, 'node_modules'),
];

module.exports = config;
