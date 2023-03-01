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
  // REMOVE
  currentCountry: null | mappers.AssociatedRecord = null;
  country: null | CountryData = null;

  loginModalShown = false;
  languageModalShown: boolean = false;
  debugTranslations: boolean = false;

  @Mutation
  setCurrentUser (user: null | user2.SessionUser) {
    this.currentUser = user;
    if (user === null) {
      this.debugTranslations = false;
    }
  }

  @Mutation
  requestAuthnFailed () {
    this.currentUser = null;
  }

  // REMOVE
  @Mutation
  setCurrentCountry (country: null | mappers.AssociatedRecord) {
    localStorage.set(localStorage.values.currentCountry, country);
    this.currentCountry = country;
  }

  @Mutation
  setCountry (country: null | CountryData) {
    localStorage.set(localStorage.values.currentCountry, country?.country);
    this.country = country;
    this.currentCountry = country?.country ?? null;
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
    const data = country
      ? await loadCountryData(country, api)
      : null;
    this.context.commit('setCountry', data);
  }

  get countryId (): null | number {
    return this.currentCountry?.id ?? null;
  }
}
