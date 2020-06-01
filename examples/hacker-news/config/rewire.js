const path = require('path');
/***********************************
 * Utils
 ***********************************/
// a simple utility to chain all of our config overrides together
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

const getLoaderRoot = (config) => {
  const oneOf = config.module.rules.find((rule) => rule.oneOf);
  if (oneOf) {
    return oneOf.oneOf;
  } else {
    return config.module.rules;
  }
};

const addLoader = (config, rule) => {
  getLoaderRoot(config).unshift(rule);
  return config;
};

const addPlugin = (config, ...plugins) => {
  plugins.forEach((p) => {
    config.plugins.push(p);
  });
  return config;
};

const getPlugin = (config, pluginName) =>
  config.plugins.find((p) => p.constructor.name === pluginName);

const getBabelLoader = (config) => {
  // Filtering out rules that don't define babel plugins.
  const babelLoaderFilter = (rule) =>
    rule.loader &&
    rule.loader.includes('babel') &&
    rule.options &&
    rule.options.plugins;

  // First, try to find the babel loader inside the oneOf array.
  // This is where we can find it when working with react-scripts@2.0.3.
  let loaders = config.module.rules.find((rule) => Array.isArray(rule.oneOf))
    .oneOf;

  let babelLoader = loaders.find(babelLoaderFilter);

  // If the loader was not found, try to find it inside of the "use" array, within the rules.
  // This should work when dealing with react-scripts@2.0.0.next.* versions.
  if (!babelLoader) {
    loaders = loaders.reduce((ldrs, rule) => ldrs.concat(rule.use || []), []);
    babelLoader = loaders.find(babelLoaderFilter);
  }
  return babelLoader;
};

// Curried function that uses config to search for babel loader and pushes new plugin to options list.
const addBabelPlugin = (plugin) => (config) => {
  getBabelLoader(config).options.plugins.push(plugin);
  return config;
};

/***********************************
 * CRA Rewiring
 ***********************************/

/**
 * This adds aliases for the build ../../common -> common/
 */
const addAliases = (config) => {
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

const enableHotReload = (config) => {
  if (process.env.NODE_ENV !== 'development') {
    return config;
  }

  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    'react-dom': '@hot-loader/react-dom'
  };

  // If in development, add 'react-hot-loader/babel' to babel plugins.
  config = addBabelPlugin('react-hot-loader/babel')(config);

  return config;
};

const addGraphqlLoader = (config) =>
  addLoader(config, {
    test: /\.(graphql|gql)$/,
    exclude: /node_modules/,
    loader: 'graphql-tag/loader'
  });

/***********************************
 * Jest Rewiring
 ***********************************/

/**
 * Add jest aliasing
 */
const jestModuleNameMapper = (config) => {
  config.moduleNameMapper = {
    ...config.moduleNameMapper,
    '^.+\\.(css|sass|scss)$': 'identity-obj-proxy',
    '^@src(.*)$': '<rootDir>/src$1',
    '^@vendor(.*)$': '<rootDir>/src/vendor$1',
    '^@api(.*)$': '<rootDir>/src/api$1',
    '^@common(.*)$': '<rootDir>/src/common$1',
    '^@components(.*)$': '<rootDir>/src/components$1',
    '^@state(.*)$': '<rootDir>/src/state$1',
    '^@views(.*)$': '<rootDir>/src/views$1',
    '^@assets(.*)$': '<rootDir>/src/assets$1'
  };

  return config;
};

/**
 * Add jest transforms
 */
const jestTransform = (config) => {
  config.transform = {
    ...config.transform,
    '^.+\\.(gql|graphql)$': 'jest-transform-graphql'
  };

  return config;
};

const jestCoverage = (config) => {
  config.collectCoverageFrom = config.collectCoverageFrom.concat([
    '!src/vendor/**/*',
    '!src/state/_template/**/*',
    '!src/**/*.story.*',
    '!src/**/*.spec.*',
    '!src/**/*mocks.*',
    '!src/**/*mock.*'
  ]);
  return config;
};

// Build the webpack config
module.exports = {
  webpack: (config, env) => {
    console.log('🚀 Launching');
    return pipe(addAliases, addGraphqlLoader, enableHotReload)(config);
  },
  jest: (config) =>
    pipe(jestCoverage, jestModuleNameMapper, jestTransform)(config)
};
