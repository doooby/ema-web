let serverHostName = process.env.SERVER_URL || 'http://localhost:3070';
if (serverHostName.endsWith('/')) {
  serverHostName = serverHostName.substring(0, serverHostName.length - 1);
}

export default {
  server: {
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 3072,
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'web',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/favicon.png' },
    ],
  },

  router: {
    base: '/web/',
  },

  publicRuntimeConfig: {
    apiBaseUrl: `${serverHostName}/api/web`,
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/css/application',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/api.ts',
    '~/plugins/global.ts',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: false,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    [ 'bootstrap-vue/nuxt', {
      bootstrapVue: {
        bootstrapCSS: false,
        bootstrapVueCSS: false,
      },
    } ],
    [ 'nuxt-i18n', {
      locales: [
        { code: 'en', file: '_async.js' },
        { code: 'cs', file: '_async.js' },
        { code: 'pt', file: '_async.js' },
        { code: 'syr', file: '_async.js' },
      ],
      defaultLocale: 'en',
      lazy: true,
      langDir: 'config/locales',
    } ],
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },
};
