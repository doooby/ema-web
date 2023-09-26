import app from '~/lib/app';

export default (context, inject: (key: string, value) => void) => {
  inject('ema', Object.freeze(new app.Ema(context)));
};

declare module 'vue/types/vue' {
  interface Vue {
    $ema: app.Ema;
  }
}
