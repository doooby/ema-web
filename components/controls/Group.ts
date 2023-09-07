import controls from '~/components/controls/index';
import { Vue } from 'vue-property-decorator';
import { Params } from '~/lib/api2';

export default class Group {
  state: controls.GroupState;

  constructor () {
    this.state = Vue.observable({
      values: Object.freeze(this.defaultState()),
    });
  }

  static compose (...fields: controls.FieldDefinition[]): Group {
    const group = new Group();
    return Object.freeze(group);
  }

  defaultState (): controls.GroupValues {
    return {};
  }

  getParamsValues (): Params {
    const params = { ...this.state.values };
    return Object.freeze(params);
  }

  update (field?: string, value?: unknown): void {
    const newValues = { ...this.state.values };
    if (field) {
      newValues[field] = value;
    }
    this.state.values = Object.freeze(newValues);
  }
}
