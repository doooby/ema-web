<template>
  <b-form-group
    :label="labelTranslation"
    :label-for="domIdBase"
  >
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
  mapToValues ({ name }: FormField, record: any, values: FormValues = {}) {
    values[name] = record[name] ?? undefined;
    return values;
  },
  mapToRecordParams ({ name }: FormField, values: FormValues, record: any = {}) {
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
