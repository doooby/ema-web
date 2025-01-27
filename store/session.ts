import { Module, Mutation, VuexModule } from 'vuex-module-decorators';
import app from '~/lib/app';
import { user } from '~/lib/records';
import { staticLists } from '~/lib/app/country/internalLists';

@Module({
  stateFactory: true,
  namespaced: true,
})
export default class SessionModule extends VuexModule {
  // TODO remove
  user: null | app.session.User = null;
  country: null | app.session.CountryData = null;
  // use this
  userSession: null | user.SessionSlice = null;
  currentCountry: null | user.CurrentCountrySlice = null;

  loginModalShown = false;
  languageModalShown = false;
  debugTranslations = false;

  @Mutation
  setUser (data: {
    session: user.SessionSlice;
    current_country: user.CurrentCountrySlice;
  }) {
    this.userSession = data.session;
    this.currentCountry = data.current_country;

    const user = data.session;
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
    this.country = {
      record: {
        id: data.current_country.record.id ?? '-1',
        caption: data.current_country.record.caption ?? 'unkown',
      },
      addressSystem: data.current_country.locations.address,
      internalLists: staticLists,
    };
  }

  @Mutation
  clearUser () {
    this.user = null;
    this.userSession = null;
    this.debugTranslations = false;
  }

  @Mutation
  clearCountry () {
    this.country = null;
    this.currentCountry = null;
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

  get countryId (): null | string {
    return this.country?.record.id ?? null;
  }

  get admissibleActions (): Record<string, string[]> {
    return this.user?.admissible_actions ?? {};
  }

  get admissionActions (): user.AdmissionActions {
    return user.AdmissionActions.parse(this.userSession?.admission?.actions);
  }
}
