import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { SessionUser } from '~/lib/records';

interface Page {
  entity: string;
  action: string;
  allowed: boolean;
}

@Module({
  stateFactory: true,
  namespaced: true,
})
export default class UserModule extends VuexModule {
  currentPage: null | Page = null;
  currentUser: null | SessionUser = null;
  loginModalShown = false;

  languageModalShown: boolean = false;

  get isPageAllowed (): boolean {
    return this.currentPage?.allowed ?? false;
  }

  @Mutation
  setCurrentPage (page: Page) {
    this.currentPage = page;
  }

  @Mutation
  setCurrentUser (user: null | SessionUser) {
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

  @Action
  async fetchSession ({ path, api }: { path: string, api: any }) {
    const page = parseRoute(path);

    const session = await api.request(
      api.queries.session.show(page),
      api.newQueryState(),
    );

    this.context.commit('setCurrentPage', {
      ...page,
      allowed: !!(session?.pageAllowed),
    });

    this.context.commit('setCurrentUser', session?.user ?? null);
  }
}

function parseRoute (path: string): {
  entity: string;
  action: string;
} {
  const groups = path.match(/^\/database\/(\w+)(?:\/([\w\d]+))?\/?/);
  return {
    entity: groups?.[1] ?? 'unknown',
    action: groups?.[2] ?? 'index',
  };
}
