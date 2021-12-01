import { Context } from '@nuxt/types';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  layout: 'app',
  async asyncData (context: Context) {
    await context.store.dispatch('session/fetchSession', {
      api: context.app.$api,
    });
  },
})
export default class AppPage extends Vue {}
