module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended',
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {
    'import/order': [ 'off' ],
    semi: [ 'off' ], // [ 'error', 'always' ],
    'object-curly-spacing': [ 'error', 'always' ],
    'array-bracket-spacing': [ 'error', 'always' ],
    'comma-dangle': [ 'error', 'always-multiline' ],
    curly: [ 'error', 'multi-line' ],
    camelcase: [ 'off' ],
    'no-use-before-define': [ 'off' ],
    'no-console': [ 'off' ],
    'no-new': [ 'off' ],
    'vue/require-valid-default-prop': [ 'off' ],
    'vue/multiline-html-element-content-newline': [ 'error', {
      allowEmptyLines: true,
    } ],
    'lines-between-class-members': [ 'off' ],
  },
};
