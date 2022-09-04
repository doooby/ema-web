import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { SessionUser } from '~/lib/records';
import * as mappers from '~/lib/api/mappers';
import * as localStorage from '~/lib/localStorage';

@Module({
  stateFactory: true,
  namespaced: true,
})
export default class UserModule extends VuexModule {
  currentUser: null | SessionUser = null;
  currentCountry: null | mappers.AssociatedRecord = null;

  loginModalShown = false;
  languageModalShown: boolean = false;
  debugTranslations: boolean = false;

  get currentCountryId (): null | number {
    return this.currentCountry?.id ?? null;
  }

  @Mutation
  setCurrentUser (user: null | SessionUser) {
    this.currentUser = user;
    if (user === null) {
      this.debugTranslations = false;
    }
  }

  @Mutation
  requestAuthnFailed () {
    this.currentUser = null;
  }

  @Mutation
  setCurrentCountry (country: null | mappers.AssociatedRecord) {
    localStorage.set(localStorage.values.currentCountry, country);
    this.currentCountry = country;
  }

  @Mutation
  showLoginModal () {
    this.loginModalShown = true;
  }

  @Mutation
  hideLoginModal () {
    this.loginModalShown = false;
  }

  @Mutation
  showLanguageModal () {
    this.languageModalShown = true;
  }

  @Mutation
  hideLanguageModal () {
    this.languageModalShown = false;
  }

  @Mutation
  toggleDebugTranslations (value: boolean) {
    this.debugTranslations = value;
  }

  @Action
  async fetchSession ({ api }: { api: any }) {
    const session = await api.request(
      api.queries.session.show(),
      api.newQueryState(),
    );
    this.context.commit('setCurrentUser', session?.user ?? null);
  }
}
