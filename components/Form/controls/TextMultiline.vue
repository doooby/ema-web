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
import { FIELD_PROPS2, FormField, FormValues } from '..';
import ControlMixin from '../ControlMixin';

export const meta = {
  name: 'textMultiline',
  mapValues (field: FormField, record: any, values: FormValues = {}) {
    const name = field[0];
    values[name] = record[name] ?? undefined;
    return values;
  },
  mapRecord (field: FormField, values: FormValues, record: any = {}) {
    const name = field[0];
    record[name] = values[name] || '';
    return record;
  },
};

export default Vue.extend({
  mixins: [ ControlMixin ],
  props: FIELD_PROPS2,
  computed: {
    sanitizedValue (): string {
      const rawValue = this.formValues[this.field[0]];
      return rawValue ? String(rawValue) : '';
    },
  },
  methods: {
    onBlur (event: {target: HTMLTextAreaElement}) {
      this.context.onChange({ [this.field[0]]: event.target.value });
    },
  },
});
</script>
