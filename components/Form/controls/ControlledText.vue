<template>
  <b-form-group
    :label="labelTranslation"
    :label-for="domIdBase"
  >
    <div class="input-group">
      <div v-if="leftLabelText" class="input-group-prepend">
        <span class="input-group-text">
          {{ leftLabelText }}
        </span>
      </div>
      <input
        :id="domIdBase"
        type="text"
        class="form-control"
        :value="sanitizedValue"
        autocomplete="off"
        @input="onInput"
      >
      <div v-if="rightLabelText" class="input-group-append">
        <span class="input-group-text">
          {{ rightLabelText }}
        </span>
      </div>
    </div>
  </b-form-group>
</template>

<script lang="ts">
import Vue from 'vue';
import { FIELD_PROPS, FormFieldType, FormField, FormValues } from '..';
import ControlMixin from '../ControlMixin';

export const type: Omit<FormFieldType, 'control'> = {
  name: 'controlledText',
  mapToValues ({ name }: FormField, record: any, values: FormValues = {}) {
    values[name] = record[name] ?? undefined;
    return values;
  },
  mapToRecord ({ name }: FormField, values: FormValues, record: any = {}) {
    record[name] = values[name] || '';
    return record;
  },
};

export default Vue.extend({
  mixins: [ ControlMixin ],
  props: FIELD_PROPS,
  computed: {
    leftLabelText (): undefined | string {
      const leftLabel = this.field.options.leftLabel;
      if (!leftLabel) return undefined;
      if (typeof leftLabel === 'function') return leftLabel();
      return String(leftLabel);
    },
    rightLabelText (): undefined | string {
      const rightLabel = this.field.options.rightLabel;
      if (!rightLabel) return undefined;
      if (typeof rightLabel === 'function') return rightLabel();
      return String(rightLabel);
    },
    sanitizedValue (): string {
      const rawValue = this.formValues[this.field.name];
      return rawValue ? String(rawValue) : '';
    },
  },
  methods: {
    onInput (event: {target: HTMLInputElement}) {
      this.context.onChange({ [this.field.name]: event.target.value });
    },
  },
});
</script>
