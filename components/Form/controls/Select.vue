<template>
  <b-form-group
    :label-for="domIdBase"
  >
    <template #label>
      <t :value="labelTranslation" />
    </template>
    <select-input
      :dom-id="domIdBase"
      :value="selected && selected.value"
      :options="options"
      @input="onChange"
    />
  </b-form-group>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import ControlMixin from '~/components/Form/ControlMixin';
import { FormField, FormFieldType, FormGroupContext, FormValues } from '~/components/Form';
import SelectInput from '~/components/Form/primitives/SelectInput.vue';
import app from '~/lib/app';

@Component({
  mixins: [ ControlMixin ],
  components: { SelectInput },
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

  get selected (): undefined | app.Option {
    const value = this.formValues[this.field.name];
    return this.options.find(option => option.value === value);
  }

  get options (): app.Option[] {
    const options = [ ...(this.field.options.options ?? []) ];
    if (this.field.options.prependEmptyValue) {
      const text = this.field.options.prependEmptyText ?? 'internal.empty_option';
      options.splice(0, 0, {
        value: undefined,
        textKey: text,
      });
    }
    return options;
  }

  onChange (value: any): void {
    const option = value ? this.options.find(option => option.value === value) : undefined;
    this.context.onChange({ [this.field.name]: option?.value });
  }
}
</script>
