import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import * as localStorage from '~/lib/localStorage';

@Module({
  stateFactory: true,
  namespaced: true,
})
export default class SessionModule extends VuexModule {
  data: null | unknown = null;

  @Mutation
  setActionData (data: null | unknown = null) {
    this.data = data;
  }

  @Action
  goToActionPage ({
    context,
    newPage,
    data = null,
  }: {
    context: any;
    newPage: string;
    data: null | unknown;
  }) {
    localStorage.set(localStorage.values.actionPageData);
    this.context.commit('setActionData', data);
    context.$router.push(newPage);
  }
}
