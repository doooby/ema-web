<template>
  <b-form-group
    :label-for="domIdBase"
  >
    <template #label>
      <t :value="labelTranslation" />
    </template>
    <div class="input-group">
      <div v-if="leftLabelText" class="input-group-prepend">
        <span v-if="leftLabelText.text" class="input-group-text">
          {{ leftLabelText.text }}
        </span>
        <span v-if="leftLabelText.t" class="input-group-text">
          <t :value="leftLabelText.t" />
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
        <span v-if="rightLabelText.text" class="input-group-text">
          {{ rightLabelText.text }}
        </span>
        <span v-if="rightLabelText.t" class="input-group-text">
          <t :value="rightLabelText.t" />
        </span>
      </div>
    </div>
  </b-form-group>
</template>

<script lang="ts">
import Vue from 'vue';
import { FormFieldType, FormField, FormValues, FormGroupContext } from '..';
import ControlMixin from '../ControlMixin';

export const type: FormFieldType = {
  name: 'integer',
  mapToValues ({ name }: FormField, record: any, values: FormValues = {}) {
    values[name] = sanitizeValue(record[name]);
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
  data () {
    return {
      value: sanitizeValue(this.formValues[this.field.name]),
    };
  },
  computed: {
    leftLabelText (): undefined | { text?: string; t?: string } {
      const leftLabel = this.field.options.leftLabel;
      if (!leftLabel) return undefined;
      if (typeof leftLabel === 'object') return leftLabel;
      if (typeof leftLabel === 'function') return leftLabel();
      return { t: String(leftLabel) };
    },
    rightLabelText (): undefined | { text?: string; t?: string } {
      const rightLabel = this.field.options.rightLabel;
      if (!rightLabel) return undefined;
      if (typeof rightLabel === 'object') return rightLabel;
      if (typeof rightLabel === 'function') return rightLabel();
      return { t: String(rightLabel) };
    },
  },
  watch: {
    formValues (newValue) {
      this.value = sanitizeValue(newValue[this.field.name]);
    },
  },
  methods: {
    toInputValue (value: undefined | number): string {
      return value === undefined ? '' : String(value);
    },
    onInput (event: {target: HTMLInputElement}): void {
      let newValue: any = event.target.value;
      newValue = newValue.replace(/[^0-9]/g, '');
      newValue = sanitizeValue(newValue);
      event.target.value = this.toInputValue(newValue);
      this.value = newValue;
    },
    onBlur (): void {
      this.context.onChange({ [this.field.name]: this.value });
    },
    onCommit (): void {},
  },
});

export function sanitizeValue (value: any): undefined | number {
  if (value === undefined || value === '') return undefined;
  value = Number(value);
  return isNaN(value) ? undefined : value;
}
</script>
