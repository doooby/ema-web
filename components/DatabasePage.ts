import { Context } from '@nuxt/types';
import { Component, Vue } from 'vue-property-decorator';
import app from '~/lib/app';
import { user } from '~/lib/records';

@Component({
  layout: 'database',
  async asyncData (context: Context) {
    await app.session.fetchUser({
      api2: context.app.$api2,
      store: context.store,
    });
  },
})
export default class DatabasePage extends Vue {
  get currentCountry (): null | user.CurrentCountrySlice {
    return this.$store.state.session.currentCountry;
  }
}
