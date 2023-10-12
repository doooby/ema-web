import { Context } from '@nuxt/types';
import { Component, Vue } from 'vue-property-decorator';
import * as localStorage from '~/lib/localStorage';
import app from '~/lib/app';

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
  beforeMount () {
    const user = this.$store.state.session.user;
    if (!user) return;

    const savedId = localStorage.get(localStorage.values.currentCountryId);
    const country = user.countries.find(country => country.id === savedId) ?? user.countries[0];
    if (country && country.id === this.$store.getters['session/countryId']) {
      return;
    }

    this.$store.dispatch('session/switchCountry', {
      country: country ?? null,
      $api2: this.$api2,
    });
  }
}
