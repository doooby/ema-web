<template>
  <b-form-group
    :label="labelText"
    :label-for="domId"
  >
    <div class="input-group">
      <div v-if="field.labels && field.labels.left" class="input-group-prepend">
        <span class="input-group-text">
          {{ field.labels.left }}
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
      <div v-if="field.labels && field.labels.right" class="input-group-append">
        <span class="input-group-text">
          {{ field.labels.right }}
        </span>
      </div>
    </div>
  </b-form-group>
</template>

<script lang="ts">
import Vue from 'vue';
import { FIELD_PROPS } from '../constants';
import { fieldCaptionGet } from '..';

export default Vue.extend({
  props: FIELD_PROPS,
  data () {
    const value = Number(this.formValues[this.field.name]);
    return {
      value: isNaN(value) ? '' : value,
    };
  },
  computed: {
    labelText (): string {
      return this.$t(fieldCaptionGet(this.field)) as string;
    },
  },
  watch: {
    formValues (newValues) {
      const value = Number(newValues[this.field.name]);
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
