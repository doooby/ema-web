import { Context } from '@nuxt/types';
import { Component, Vue } from 'vue-property-decorator';
import { user2 } from '~/lib/records';
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
  get currentUser (): null | user2.SessionUser {
    return this.$store.state.session.currentUser;
  }

  get currentCountryId (): null | number {
    return this.$store.state.session.currentCountry?.id ?? null;
  }

  beforeMount () {
    const currentUser = this.currentUser;
    if (!currentUser) return;
    const savedId = localStorage.get(localStorage.values.currentCountry)?.id;
    const country = currentUser.countries.find(country => country.id === savedId) ?? currentUser.countries[0];
    this.$store.commit('session/setCurrentCountry', country ?? null);
  }
}
