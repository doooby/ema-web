import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import * as localStorage from '~/lib/localStorage';
import { Api2Plugin, BRecord } from '~/lib/api2';
import app from '~/lib/app';
import { user } from '~/lib/records';

@Module({
  stateFactory: true,
  namespaced: true,
})
export default class SessionModule extends VuexModule {
  user: null | app.session.User = null;
  user2: null | user.SessionSlice = null;
  country: null | app.session.CountryData = null;

  loginModalShown = false;
  languageModalShown: boolean = false;
  debugTranslations: boolean = false;

  @Mutation
  setUser (user: user.SessionSlice) {
    this.user2 = user;
    this.user = {
      id: user.id,
      login: user.login,
      name: user.name,
      countries: user.countries.map(
        country => ({
          id: country.id ?? '-1',
          caption: country.caption ?? 'unknown',
        }),
      ),
      admissible_actions: user.admissible_actions as app.Maybe<Record<string, string[]>>,
    };
  }

  @Mutation
  clearUser () {
    this.user = null;
    this.debugTranslations = false;
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
  async switchCountry ({
    country,
    $api2,
  }: {
    country: null | BRecord;
    $api2: Api2Plugin;
  }) {
    this.context.commit('setCountry', undefined);
    if (!country) return;
    country = Object.freeze({ ...country });
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
