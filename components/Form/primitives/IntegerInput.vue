<template>
  <input
    :id="domId"
    type="text"
    :class="[ 'form-control', $attrs.class ]"
    :value="inputValue"
    :disabled="disabled"
    autocomplete="off"
    :maxlength="maxLength"
    @input="onInput"
    @focus="onFocus"
    @blur="onBlur"
  >
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

@Component
export default class IntegerInput extends Vue {
  @Prop({ default: () => undefined }) readonly domId?: string;
  @Prop({ required: true }) readonly value!: any;
  @Prop() readonly disabled?: boolean;
  @Prop() readonly maxLength?: number;

  internalValue = sanitizeValue(this.value);
  inputValue = sanitizeInputValue(this.internalValue);
  focused = false;

  @Watch('value')
  onDefaultValueChange (newValue: any) {
    if (!this.focused) {
      this.internalValue = sanitizeValue(newValue);
      this.inputValue = sanitizeInputValue(this.internalValue);
    }
  }

  onInput (event: {target: HTMLInputElement}): void {
    const domValue = event.target.value;
    this.internalValue = sanitizeValue(domValue.replace(/[^0-9]/g, ''));
    this.inputValue = sanitizeInputValue(this.internalValue);
    if (this.inputValue !== domValue) {
      event.target.value = this.inputValue;
    }
  }

  onFocus () {
    this.focused = true;
  }

  onBlur () {
    this.focused = false;
    this.$emit('change', this.internalValue ?? undefined);
  }
}

function sanitizeValue (value: any): null | number {
  if (!value) {
    return value === 0 ? 0 : null;
  }
  const integer = parseInt(value);
  return isNaN(value) ? null : integer;
}

function sanitizeInputValue (value: null | number): string {
  return value === null ? '' : String(value);
}
</script>
