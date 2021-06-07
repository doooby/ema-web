import { Module, VuexModule, Mutation } from 'vuex-module-decorators';
import { ApiRequest } from '~/lib/api';

@Module({
  name: 'api',
  stateFactory: true,
  namespaced: true,
})
export default class ApiModule extends VuexModule {
  requests: ApiRequest[] = [];

  @Mutation
  addQuery (request: ApiRequest) {
    this.requests.push(request);
    request.running = true;
  }

  @Mutation
  removeQuery (request: ApiRequest) {
    const index = this.requests.indexOf(request);
    if (index !== -1) {
      this.requests.splice(index, 1);
    }
    request.running = false;
  }

  @Mutation
  dropAll () {
    for (const request of this.requests) {
      request.running = false;
      request.canceled = true;
    }
    this.requests.length = 0;
  }
}
