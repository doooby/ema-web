<template>
  <b-form-group :label-for="domIdBase">
    <template #label>
      <t :value="labelTranslation" />
    </template>
    <div class="input-group">
      <textarea
        :id="domIdBase"
        class="form-control"
        :value="sanitizedValue"
        @blur="onBlur"
      />
    </div>
  </b-form-group>
</template>

<script lang="ts">
import Vue from 'vue';
import { FormFieldType, FormField, FormValues, FormGroupContext } from '..';
import ControlMixin from '../ControlMixin';

export const type: FormFieldType = {
  name: 'textMultiline',
  fillValues ({ name }, record, values) {
    values[name] = record[name] ?? undefined;
    return values;
  },
  fillParams ({ name }, values, record) {
    record[name] = values[name] || '';
    return record;
  },
};

export default Vue.extend({
  mixins: [ ControlMixin ],
  props: {
    field: { type: Object as Vue.PropType<FormField>, required: true },
    context: { type: Object as Vue.PropType<FormGroupContext>, required: true },
    formValues: { type: Object as Vue.PropType<FormValues>, required: true },
  },
  computed: {
    sanitizedValue (): string {
      const rawValue = this.formValues[this.field.name];
      return rawValue ? String(rawValue) : '';
    },
  },
  methods: {
    onBlur (event: {target: HTMLTextAreaElement}) {
      this.context.onChange({ [this.field.name]: event.target.value });
    },
  },
});
</script>
