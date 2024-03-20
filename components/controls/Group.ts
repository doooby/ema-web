import controls from '~/components/controls/index';
import { Vue } from 'vue-property-decorator';
import { Params } from '~/lib/api2';
import app from '~/lib/app';

export default class Group {
  state: controls.GroupState;

  constructor (
    fields: controls.FieldDefinition[],
  ) {
    this.state = Vue.observable({
      values: {},
      params: {},
      fields: app.reduceObjects(fields, field => field.name),
    });

    this.state.values = this.buildDefaultValues();
    this.state.params = this.buildParams();
  }

  static new (
    ...fields: app.SparseList<
      string
      | controls.FieldDefinition
    >
  ): Group {
    const composer = new Group.Composer();
    for (const field of fields) {
      if (field === undefined) continue;

      let fieldDefinition: controls.FieldDefinition;
      if (typeof field === 'string') {
        fieldDefinition = { name: field };
      } else {
        fieldDefinition = field;
      }
      composer.add(fieldDefinition);
    }
    return composer.finalize();
  }

  // TODO deprecated, use `Group.new()`
  static compose (...fields: controls.FieldDefinition[]): Group {
    const group = new Group(fields);
    return Object.freeze(group) as Group;
  }

  static Composer = class Composer {
    fields: controls.FieldDefinition[] = [];

    add (field: controls.FieldDefinition) {
      this.fields.push(Object.freeze(field));
    }

    finalize (): Group {
      const group = new Group(this.fields);
      return Object.freeze(group) as Group;
    }
  }

  getField (field: string) {
    return this.state.fields?.[field];
  }

  getValue (field: string): unknown {
    return this.state.values[field];
  }

  getParam (field: string): unknown {
    return this.state.params[field];
  }

  getParams () {
    return { ...this.state.params };
  }

  update (field?: string, value?: unknown): void {
    const newValues = { ...this.state.values };
    if (field) {
      if (typeof value === 'function') {
        value = value(this.getValue(field));
      }
      newValues[field] = value;
      this.getField(field)?.onChange?.(newValues);
    }
    this.state.values = Object.freeze(newValues);
    this.state.params = this.buildParams();
  }

  updateField (field: controls.FieldDefinition) {
    const name = field.name;
    this.state.fields = Object.freeze({
      ...this.state.fields,
      [name]: field,
    });
  }

  reset (): void {
    this.state.values = this.buildDefaultValues();
    this.state.params = this.buildParams();
  }

  static defaultOf (field: controls.FieldDefinition) {
    if (Object.prototype.hasOwnProperty.call(field, 'default')) {
      if (typeof field.default === 'function') {
        return field.default();
      } else {
        return field.default;
      }
    }
  }

  private get fields () {
    return (
      this.state.fields ? Object.values(this.state.fields) : []
    ).filter(id => id) as controls.FieldDefinition[];
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

  private buildDefaultValues (): app.Map<unknown> {
    const newValue = {};
    for (const field of this.fields) {
      newValue[field.name] = Group.defaultOf(field);
    }
    return Object.freeze(newValue);
  }
}
