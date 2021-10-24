import { Module, VuexModule, Mutation } from 'vuex-module-decorators';

@Module({
  name: 'user',
  stateFactory: true,
  namespaced: true,
})
export default class UserModule extends VuexModule {
  currentUser: null | any = null;

  loginModalShown: boolean = false;
  languageModalShown: boolean = false;

  @Mutation
  setCurrentUser (user: null | any) {
    this.currentUser = user;
  }

  @Mutation
  authenticationFail () {
    this.loginModalShown = true;
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
}
