<template>
  <b-form-group
    :label-for="domIdBase"
  >
    <template #label>
      <t :value="labelTranslation" />
    </template>
    <b-form-select
      :id="domIdBase"
      :value="selected && selected.value"
      :options="options"
      @change="onChange"
    />
  </b-form-group>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import ControlMixin from '~/components/Form/ControlMixin';
import { FormField, FormFieldType, FormGroupContext, FormValues } from '~/components/Form';

type Option = { value: string, text: string };

@Component({
  mixins: [ ControlMixin ],
})
export default class Select extends Vue {
  static fieldType: FormFieldType = {
    name: 'select',
    fillParams ({ name }, values, record) {
      const value = values[name];
      record[name] = value === undefined ? '' : value;
      return record;
    },
  };

  @Prop({ required: true }) field!: FormField;
  @Prop({ required: true }) context!: FormGroupContext;
  @Prop({ required: true }) formValues!: FormValues;

  get selected (): undefined | Option {
    const value = this.formValues[this.field.name];
    return this.options.find(option => option.value === value);
  }

  get options (): Array<Option> {
    return this.field.options.options ?? [];
  }

  onChange (value: any): void {
    const option = value ? this.options.find(option => option.value === value) : undefined;
    this.context.onChange({ [this.field.name]: option?.value });
  }
}
</script>
