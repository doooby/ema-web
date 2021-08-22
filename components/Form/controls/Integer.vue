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
import { FIELD_PROPS } from '../constants';

export default Vue.extend({
  props: FIELD_PROPS,
  data () {
    const value = Number(this.formValues[this.field[0]]);
    return {
      value: isNaN(value) ? '' : value,
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
      const value = Number(newValues[this.field[0]]);
      this.value = isNaN(value) ? '' : value;
    },
  },
  methods: {
    onInput (event: {target: HTMLInputElement}): void {
      const value = Number(event.target.value);
      if (!isNaN(value)) this.value = value;
      else event.target.value = String(this.value);
    },
    onBlur (): void {
      this.$emit('change', this.value);
    },
    onCommit (): void {
      this.$emit('commit');
    },
  },
});
</script>
