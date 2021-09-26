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
        :value="value"
        autocomplete="off"
        @input="onInput"
        @blur="onBlur"
        @keypress.ctrl.enter="onCommit"
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
  name: 'integer',
  mapToValues ({ name }: FormField, record: any, values: FormValues = {}) {
    values[name] = sanitizeValue(record[name]);
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
  data () {
    return {
      value: sanitizeValue(this.formValues[this.field.name]),
    };
  },
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
  },
  watch: {
    formValues (newValues) {
      this.value = sanitizeValue(newValues[this.field.name]);
    },
  },
  methods: {
    onInput (event: {target: HTMLInputElement}): void {
      const { target } = event;
      if (target.value === '') {
        this.value = undefined;
        return;
      }

      const newValue = sanitizeValue(target.value);
      if (newValue === undefined && this.value !== undefined) return;
      this.value = newValue;
    },
    onBlur (): void {
      this.context.onChange({ [this.field.name]: this.value });
    },
    onCommit (): void {},
  },
});

function sanitizeValue (value: any): undefined | number {
  if (value === undefined || value === '') return undefined;
  value = Number(value);
  return isNaN(value) ? undefined : value;
}
</script>
