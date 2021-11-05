import { Context } from '@nuxt/types';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  layout: 'database',
  async asyncData (context: Context) {
    await context.store.dispatch('session/fetchSession', {
      path: context.route.path,
      api: context.app.$api,
    });
  },
})
export default class DatabasePageMixin extends Vue {}
