import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';

@Module({
  stateFactory: true,
  namespaced: true,
})
export default class SessionModule extends VuexModule {
  data: null | unknown = null;

  @Mutation
  setActionData (data: null | unknown) {
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
    this.context.commit('setActionData', data);
    context.$router.push(newPage);
  }
}
