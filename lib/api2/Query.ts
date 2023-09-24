import { api } from '~/lib/api2/module';

export default class Query<D> {
  builder: Builder<D>;

  constructor (definition: api.QueryDefinition<D>) {
    this.builder = new Builder(definition);
  }

  toDefinition () {
    return this.builder.definition;
  }
}

class Builder<D> {
  // eslint-disable-next-line no-useless-constructor
  constructor (readonly definition: api.QueryDefinition<D>) { }
}
