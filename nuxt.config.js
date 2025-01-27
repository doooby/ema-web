// const isProduction = process.env.NODE_ENV === 'production';

let serverHostName = process.env.SERVER_URL || 'http://127.0.0.1:3070';
if (serverHostName.endsWith('/')) {
  serverHostName = serverHostName.substring(0, serverHostName.length - 1);
}

export default {
  vue: {
    config: {
      performance: true,
    },
  },

  server: {
    host: process.env.HOST || '127.0.0.1',
    port: process.env.PORT || 3072,
  },

  // TODO does this work?
  // ssr: false,
  // target: 'static',

  generate: {
    devtools: true,
  },

  publicRuntimeConfig: {
    apiBaseUrl: `${serverHostName}/api/web`,
    appEnv: process.env.APP_ENV || undefined,
  },

  router: {
    base: '/web/',
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
      { rel: 'icon', type: 'image/png', href: '/web/favicon.png' },
    ],
  },

  i18n: {
    strategy: 'no_prefix',
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/css/application',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: false,

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/admission.ts',
    '~/plugins/api2.ts',
    '~/plugins/ema.ts',
    '~/plugins/global.ts',
  ],

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
        { code: 'ar', file: '_async.js' },
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
