import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { user2, loadCountryData } from '~/lib/records';
import * as mappers from '~/lib/api/mappers';
import * as localStorage from '~/lib/localStorage';
import { CountryData } from '~/store/session/country';

@Module({
  stateFactory: true,
  namespaced: true,
})
export default class SessionModule extends VuexModule {
  currentUser: null | user2.SessionUser = null;
  user: null | user2.SessionUser = null;
  countryData: null | CountryData = null;

  loginModalShown = false;
  languageModalShown: boolean = false;
  debugTranslations: boolean = false;

  @Mutation
  setCurrentUser (user: null | user2.SessionUser) {
    this.currentUser = user;
    this.user = user;
    if (user === null) {
      this.debugTranslations = false;
    }
  }

  @Mutation
  requestAuthnFailed () {
    this.currentUser = null;
    this.user = null;
  }

  @Mutation
  setCountryData (countryData: null | CountryData) {
    localStorage.set(localStorage.values.currentCountry, countryData?.country);
    this.countryData = countryData;
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

  @Action
  async switchCountry ({
    country,
    api,
  }: {
    country: null | mappers.AssociatedRecord
    api: any
  }) {
    this.context.commit('setCountryData', null);
    if (!country) return;

    const data = await loadCountryData(country, api);
    this.context.commit('setCountryData', data);
  }

  get countryId (): null | number {
    return this.countryData?.country?.id ?? null;
  }
}
