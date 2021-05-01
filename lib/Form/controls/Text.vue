<template>
  <b-form-group
    label="field.label"
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
      return 'uff';
    },
  },
  methods: {
    onBlur (): void {
      const newValue = 'nuff';
      this.$emit('change', newValue);
    },
  },
});
</script>
