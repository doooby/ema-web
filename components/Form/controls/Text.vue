<template>
  <b-form-group
    :label="labelText"
    :label-for="domId"
  >
    <input
      :id="domId"
      type="text"
      class="form-control"
      :value="sanitizedValue"
      @blur="onBlur"
      @keypress.enter="onCommit"
    >
  </b-form-group>
</template>

<script lang="ts">
import Vue from 'vue';
import { FIELD_PROPS } from '../constants';
import { fieldCaptionGet } from '..';

export default Vue.extend({
  props: FIELD_PROPS,
  computed: {
    labelText (): string {
      return this.$t(fieldCaptionGet(this.field)) as string;
    },
    sanitizedValue (): string {
      const rawValue = this.formValues[this.field.name];
      return rawValue ? String(rawValue) : '';
    },
  },
  methods: {
    onBlur (event: {target: HTMLInputElement}) {
      this.$emit('change', event.target.value);
    },
    onCommit (event: {target: HTMLInputElement}) {
      this.$emit('change', event.target.value);
      this.$emit('commit');
    },
  },
});
</script>
