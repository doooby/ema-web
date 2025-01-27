import { Context } from '@nuxt/types';
import { Component, Vue } from 'vue-property-decorator';
import app from '~/lib/app';

@Component({
  layout: 'app',
  async asyncData (context: Context) {
    await app.session.fetchUser({
      api2: context.app.$api2,
      store: context.store,
    });
  },
})
export default class AppPage extends Vue {}
