import { Module, VuexModule, Mutation } from 'vuex-module-decorators';

interface Page {
  entity: string;
  action: string;
  allowed: boolean;
}

@Module({
  name: 'dbPage',
  stateFactory: true,
  namespaced: true,
})
export default class DbPageModule extends VuexModule {
  currentPage: null | Page = null;

  @Mutation
  setPage (page: Page) {
    this.currentPage = page;
  }

  get entity (): string {
    return this.currentPage?.entity ?? 'unknown';
  }

  get allowed (): boolean {
    return this.currentPage?.allowed ?? false;
  }
}
