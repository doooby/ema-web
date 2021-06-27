<template>
  <b-form-group
    :label="labelText"
    :label-for="domId"
  >
    {{ valueText }}
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
    valueText (): string {
      const control = this.field.control;
      if (typeof control !== 'object' || control.type !== 'assoc') return '';
      const assoc = this.formValues[this.field.name];
      if (!assoc) return '';
      return control.getText ? control.getText(assoc) : assoc.name;
    },
  },
});
</script>
