<template>
  <b-form-group>
    <template #label>
      <t :value="labelTranslation" />
    </template>
    <DateInput
      :dom-id="domIdBase"
      :value="sanitizedValue"
      @change="onChange"
    />
  </b-form-group>
</template>

<script lang="ts">
import Vue from 'vue';
import { FormField, FormFieldType, FormGroupContext, FormValues } from '..';
import ControlMixin from '../ControlMixin';
import { DateInput } from '~/components/controls/inputs';

export const type: FormFieldType = {
  name: 'calendar',
  fillValues ({ name }, record, values) {
    values[name] = utils.sanitizedDate(record[name]);
    return values;
  },
  fillParams ({ name }, values, record) {
    const date = values[name];
    record[name] = (date && utils.formatDate(date)) ?? '';
    return record;
  },
};
export default Vue.extend({
  components: { DateInput },
  mixins: [ ControlMixin ],
  props: {
    field: { type: Object as Vue.PropType<FormField>, required: true },
    context: { type: Object as Vue.PropType<FormGroupContext>, required: true },
    formValues: { type: Object as Vue.PropType<FormValues>, required: true },
  },
  computed: {
    sanitizedValue (): undefined | Date {
      const rawValue = this.formValues[this.field.name];
      return (rawValue instanceof Date && !isNaN(rawValue as any))
        ? rawValue
        : undefined;
    },
  },
  methods: {
    onChange (date) {
      this.context.onChange({ [this.field.name]: date });
    },
  },
});
</script>
