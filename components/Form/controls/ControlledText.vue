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
import { FIELD_PROPS2, FormField, FormValues } from '..';
import ControlMixin from '../ControlMixin';

export const meta = {
  name: 'controlledText',
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
    leftLabelText (): undefined | string {
      const leftLabel = (this.field[2] as any)?.leftLabel;
      if (!leftLabel) return undefined;
      if (typeof leftLabel === 'function') return leftLabel();
      return String(leftLabel);
    },
    rightLabelText (): undefined | string {
      const rightLabel = (this.field[2] as any)?.rightLabel;
      if (!rightLabel) return undefined;
      if (typeof rightLabel === 'function') return rightLabel();
      return String(rightLabel);
    },
    sanitizedValue (): string {
      const rawValue = this.formValues[this.field[0]];
      return rawValue ? String(rawValue) : '';
    },
  },
  methods: {
    onInput (event: {target: HTMLInputElement}) {
      this.context.onChange({ [this.field[0]]: event.target.value });
    },
  },
});
</script>
