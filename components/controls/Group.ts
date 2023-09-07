import controls from '~/components/controls/index';
import { Vue } from 'vue-property-decorator';
import { Params } from '~/lib/api2';

export default class Group {
  fieldsIndex: Record<string, controls.FieldDefinition>;

  state: controls.GroupState;

  constructor (readonly fields: controls.FieldDefinition[]) {
    this.fieldsIndex = fields.reduce(
      (index, field) => {
        index[field.name] = field;
        return index;
      },
      {},
    );
    this.state = Vue.observable({
      values: this.buildDefaultState(),
      params: {},
    });
    this.state.params = this.buildParams();
  }

  static compose (...fields: controls.FieldDefinition[]): Group {
    const group = new Group(fields);
    return Object.freeze(group) as Group;
  }

  getValue (field: string): unknown {
    return this.state.values[field];
  }

  getParam (field: string): unknown {
    return this.state.params[field];
  }

  update (field?: string, value?: unknown): void {
    const newValues = { ...this.state.values };
    if (field) {
      newValues[field] = value;
    }
    this.state.values = Object.freeze(newValues);
    this.state.params = this.buildParams();
  }

  private buildParams (): Params {
    const values = this.state.values;
    const params: Params = { ...values };
    for (const { name, populateParams } of this.fields) {
      if (populateParams) {
        delete params[name];
        populateParams(values, params);
      }
    }
    return Object.freeze(params);
  }

  private buildDefaultState (): controls.GroupValues {
    const newValue = {};
    for (const field of this.fields) {
      if (Object.prototype.hasOwnProperty.call(field, 'default')) {
        if (typeof field.default === 'function') {
          newValue[field.name] = field.default();
        } else {
          newValue[field.name] = field.default;
        }
      }
    }
    return Object.freeze(newValue);
  }
}
