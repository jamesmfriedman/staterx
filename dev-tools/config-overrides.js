const path = require('path');

module.exports = function override(config, env) {
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    react: path.resolve('./node_modules/react'),
    '@src': path.resolve('./', 'src'),
    '@vendor': path.resolve('./', 'src/vendor'),
    '@common': path.resolve('./', 'src/common'),
    '@components': path.resolve('./', 'src/components'),
    '@state': path.resolve('./', 'src/state'),
    '@views': path.resolve('./', 'src/views'),
    '@assets': path.resolve('./', 'src/assets')
  };
  return config;
};
