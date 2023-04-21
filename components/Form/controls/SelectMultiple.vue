<template>
  <b-form-group
    :label-for="domIdBase"
  >
    <template #label>
      <t :value="labelTranslation" />
    </template>
    <select-multiple-input
      :dom-id="domIdBase"
      :value="selected"
      :options="options"
      @input="onChange"
    />
  </b-form-group>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import ControlMixin from '~/components/Form/ControlMixin';
import { FormField, FormFieldType, FormGroupContext, FormValues } from '~/components/Form';
import SelectMultipleInput from '~/components/Form/primitives/SelectMultipleInput.vue';
import app from '~/lib/app';

@Component({
  mixins: [ ControlMixin ],
  components: { SelectMultipleInput },
})
export default class SelectMultiple extends Vue {
  static fieldType: FormFieldType = {
    name: 'selectMultiple',
    fillParams ({ name }, values, record) {
      const value = values[name];
      record[name] = value?.length ? value : [];
      return record;
    },
  };

  @Prop({ required: true }) field!: FormField;
  @Prop({ required: true }) context!: FormGroupContext;
  @Prop({ required: true }) formValues!: FormValues;

  get selected (): app.Option[] {
    return this.filterOptions(this.formValues[this.field.name]);
  }

  get options (): app.Option[] {
    return (this.field.options.options ?? []);
  }

  onChange (value: any): void {
    this.context.onChange({ [this.field.name]: this.filterOptions(value) });
  }

  filterOptions (value: any): app.Option[] {
    if (!Array.isArray(value)) return [];
    return value.filter(item => this.options.find(option => option.value === item));
  }
}
</script>
