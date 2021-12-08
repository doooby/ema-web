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
        :value="sanitizedValue"
        autocomplete="off"
        v-on="interactive ? { input: onInput} : { blur: onInput }"
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
  name: 'text',
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
    sanitizedValue (): string {
      const rawValue = this.formValues[this.field.name];
      return rawValue ? String(rawValue) : '';
    },
  },
  methods: {
    onInput (event: {target: HTMLInputElement}) {
      (this as any).debouncedOnChange({ [this.field.name]: event.target.value });
    },
    onCommit () {},
  },
});
</script>
