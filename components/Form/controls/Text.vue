<template>
  <b-form-group
    :label="labelText()"
    :label-for="domId"
  >
    <input
      :id="domId"
      type="text"
      class="form-control"
      :value="sanitizedValue"
      @blur="onBlur"
    >
  </b-form-group>
</template>

<script lang="ts">
import Vue from 'vue';
import { FIELD_PROPS } from '..';

export default Vue.extend({
  props: FIELD_PROPS,
  computed: {
    sanitizedValue (): string {
      const rawValue = this.formValues[this.field.name];
      return rawValue ? String(rawValue) : '';
    },
  },
  methods: {
    labelText () {
      return this.$t(this.field.t || 'form.field.unknown');
    },
    onBlur (event: {target: HTMLInputElement}): void {
      this.$emit('change', event.target.value);
    },
  },
});
</script>
