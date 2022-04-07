<template>
  <b-form-checkbox
    :id="domIdBase"
    :checked="sanitizedValue"
    @input="onInput"
  >
    <t :value="labelTranslation" />
  </b-form-checkbox>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import ControlMixin from '~/components/Form/ControlMixin';
import { FormField, FormFieldType, FormGroupContext, FormValues } from '~/components/Form';

@Component({
  mixins: [ ControlMixin ],
})
export default class Boolean extends Vue {
  static fieldType: FormFieldType = {
    name: 'boolean',
    fillValues ({ name }, record, values) {
      let value = record[name];
      if (value !== undefined) value = !!value;
      values[name] = value;
      return values;
    },
    fillParams ({ name }, values, record) {
      record[name] = values[name] ? '1' : '0';
      return record;
    },
  };

  @Prop({ required: true }) field!: FormField;
  @Prop({ required: true }) context!: FormGroupContext;
  @Prop({ required: true }) formValues!: FormValues;

  get sanitizedValue (): boolean {
    return !!this.formValues[this.field.name];
  }

  onInput (checked: any) {
    this.context.onChange({ [this.field.name]: checked });
  }
}
</script>
