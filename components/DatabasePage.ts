import { Context } from '@nuxt/types';
import { Component, Vue } from 'vue-property-decorator';
import * as localStorage from '~/lib/localStorage';

@Component({
  layout: 'database',
  async asyncData (context: Context) {
    await context.store.dispatch('session/fetchSession', {
      api: context.app.$api,
    });
  },
})
export default class DatabasePage extends Vue {
  beforeMount () {
    const user = this.$store.state.session.currentUser;
    if (!user) return;

    const savedId = localStorage.get(localStorage.values.currentCountry)?.id;
    const country = user.countries.find(country => country.id === savedId) ?? user.countries[0];
    if (country && country.id === this.$store.getters['session/countryId']) {
      return;
    }

    this.$store.dispatch('session/switchCountry', {
      country: country ?? null,
      api: this.$api,
    });
  }
}
