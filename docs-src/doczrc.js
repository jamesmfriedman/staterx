import { css } from 'docz-plugin-css';

export default {
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
    {
      name: 'Examples',
      menu: [
        { name: 'HackerNews Clone', href: 'https://github.com/' },
        { name: 'Pong', href: 'https://github.com/' }
      ]
    }
  ]
};
