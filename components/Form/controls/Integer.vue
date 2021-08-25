<template>
  <b-form-group
    :label="label"
    :label-for="domId"
  >
    <div class="input-group">
      <div v-if="leftLabelText" class="input-group-prepend">
        <span class="input-group-text">
          {{ leftLabelText }}
        </span>
      </div>
      <input
        :id="domId"
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
import { FIELD_PROPS } from '..';

export default Vue.extend({
  props: FIELD_PROPS,
  data () {
    return {
      value: sanitizeValue(this.formValues[this.field[0]]),
    };
  },
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
  },
  watch: {
    formValues (newValues) {
      this.value = sanitizeValue(newValues[this.field[0]]);
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
      this.$emit('change', this.value);
    },
    onCommit (): void {
      this.$emit('commit');
    },
  },
});

function sanitizeValue (value: any): undefined | number {
  if (value === undefined || value === '') return undefined;
  value = Number(value);
  return isNaN(value) ? undefined : value;
}
</script>
