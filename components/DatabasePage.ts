import { Context } from '@nuxt/types';
import { Component, Vue } from 'vue-property-decorator';
import { SessionUser } from '~/lib/records';
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
  get currentUser (): null | SessionUser {
    return this.$store.state.session.currentUser;
  }

  get currentCountryId (): null | number {
    return this.$store.state.session.currentCountry?.id ?? null;
  }

  beforeMount () {
    const user = this.currentUser;
    if (!user) return;
    const savedId = localStorage.get(localStorage.values.currentCountry)?.id;
    const country = user.countries.find(country => country.id === savedId) ?? user.countries[0];
    this.$store.commit('session/setCurrentCountry', country ?? null);
  }
}
