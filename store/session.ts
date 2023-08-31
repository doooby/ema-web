import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import * as localStorage from '~/lib/localStorage';
import { Api2Plugin, BRecord } from '~/lib/api2';
import app from '~/lib/app';

@Module({
  stateFactory: true,
  namespaced: true,
})
export default class SessionModule extends VuexModule {
  user: null | app.session.User = null;
  country: null | app.session.CountryData = null;

  loginModalShown = false;
  languageModalShown: boolean = false;
  debugTranslations: boolean = false;

  @Mutation
  setUser (user: null | app.session.User) {
    this.user = user;
    if (user === null) {
      this.debugTranslations = false;
    }
  }

  @Mutation
  setCountry (data: null | app.session.CountryData) {
    localStorage.set(localStorage.values.currentCountryId, data?.record.id);
    this.country = data;
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
  toggleDebugTranslations () {
    this.debugTranslations = !this.debugTranslations;
  }

  @Action
  async fetchSession ({ api2 }: { api2: Api2Plugin }) {
    const session = await api2.transientRequest(app.session.queries.getSession());
    this.context.commit('setUser', session.ok ? session.payload.user : null);
  }

  @Action
  async switchCountry ({
    country,
    $api2,
  }: {
    country: null | BRecord;
    $api2: Api2Plugin;
  }) {
    this.context.commit('setCountry', null);
    if (!country) return;
    const data = await app.session.loadCountryData(country, $api2);
    this.context.commit('setCountry', data);
  }

  get countryId (): null | string {
    return this.country?.record.id ?? null;
  }

  get admissibleActions (): Record<string, string[]> {
    return this.user?.admissible_actions ?? {};
  }
}
