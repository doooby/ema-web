<template>
  <b-form-group>
    <template #label>
      <t :value="labelTranslation" />
    </template>
    fdsfsdf
  </b-form-group>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { FormField, FormFieldType, FormGroupContext, FormValues } from '~/components/Form';
import ControlMixin from '~/components/Form/ControlMixin';

@Component({
  mixins: [ ControlMixin ],
})
export default class RecurrenceSelection extends Vue {
  static fieldType: FormFieldType = {
    mapToValues ({ name, options }: FormField, _record: any, values: FormValues = {}) {
      // values[name] = options.value;
      return values;
    },
    mapToRecordParams ({ name }: FormField, values: FormValues, record: any = {}) {
      // record[name] = String(values[name]) || '';
      return record;
    },
  }

  static get asControl (): FormFieldType {
    return {
      ...this.fieldType,
      control: RecurrenceSelection,
    };
  }

  @Prop({ required: true }) field!: FormField;
  @Prop({ required: true }) context!: FormGroupContext;
  @Prop({ required: true }) formValues!: FormValues;
}
</script>
