<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import app from '~/lib/app';

@Component
export default class IntegerInput extends Vue {
  @Prop() readonly domId?: string;
  @Prop() readonly disabled?: boolean;
  @Prop() readonly value?: number;

  internalValue: app.Maybe<number> = undefined;
  inputValue = '';

  created () {
    this.onValueChanged();
  }

  @Watch('value')
  onValueChanged () {
    this.internalValue = sanitizeValue(this.value);
    this.inputValue = sanitizeInputValue(this.internalValue);
  }

  onChange (event: { target: HTMLInputElement }): void {
    this.invokeChange(event.target);
  }

  onSubmit (event: { target: HTMLInputElement }): void {
    this.invokeChange(event.target);
    this.$emit('submit');
  }

  invokeChange (input: HTMLInputElement) {
    this.internalValue = sanitizeValue(input.value.replace(/[^0-9]/g, ''));
    this.inputValue = sanitizeInputValue(this.internalValue);
    if (this.inputValue !== input.value) {
      input.value = this.inputValue;
    }
    if (this.internalValue !== this.value) {
      this.$emit('input', this.internalValue);
      this.$emit('change', this.internalValue);
    }
  }
}

function sanitizeValue (value): app.Maybe<number> {
  if (!value) return value === 0 ? 0 : undefined;
  const integer = parseInt(value);
  return isNaN(value) ? undefined : integer;
}

function sanitizeInputValue (value: app.Maybe<number>): string {
  return value === undefined ? '' : String(value);
}
</script>

<template>
  <input
    :id="domId"
    type="text"
    :class="[ 'form-control', $attrs.class ]"
    :value="inputValue"
    :disabled="disabled"
    autocomplete="off"
    @blur="onChange"
    @keypress.exact.enter.stop="onChange"
    @keypress.ctrl.enter.stop="onSubmit"
  >
</template>
