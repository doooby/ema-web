import { Component, Vue } from 'vue-property-decorator';
import { user } from '~/lib/records';
import { Context } from '@nuxt/types';

@Component({
  layout: 'database',
  async asyncData (context: Context) {
    await context.store.dispatch('session/fetchSession', {
      api: context.app.$api,
    });
  },
})
export default class DatabasePageBase extends Vue {
  get currentUser (): null | user.SessionUser {
    return this.$store.state.session.currentUser;
  }

  get currentCountryId (): null | number {
    return this.$store.state.session.country?.country?.id ?? null;
  }
}
