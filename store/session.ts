import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { SessionUser } from '~/lib/records';

@Module({
  stateFactory: true,
  namespaced: true,
})
export default class UserModule extends VuexModule {
  currentUser: null | SessionUser = null;
  loginModalShown = false;

  languageModalShown: boolean = false;
  debugTranslations: boolean = false;

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
