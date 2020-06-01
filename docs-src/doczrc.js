import { css } from 'docz-plugin-css';

export default {
  base: '/staterx/',
  typescript: true,
  plugins: [
    css({
      preprocessor: 'sass',
      cssmodules: true
    })
  ],
  menu: [
    'StateRx',
    'Quick Start',
    { name: 'Guides', menu: ['React', 'Flux'] },
    {
      name: 'Api',
      menu: [
        'Options',
        'createValue',
        'createObject',
        'createArray',
        'createItems',
        'createStore'
      ]
    },
    'Examples'
  ]
};
