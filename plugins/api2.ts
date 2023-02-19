import { Context } from '@nuxt/types';
import { Api2Plugin } from '~/lib/api2';

export default (context: Context, inject: (key: string, value) => void) => {
  inject('api2', Object.freeze(new Api2Plugin(context)));
};

declare module 'vue/types/vue' {
  interface Vue {
    $api2: Api2Plugin;
  }
}
