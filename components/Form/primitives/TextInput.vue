<template>
  <input
    :id="domId"
    type="text"
    :class="[ 'form-control', $attrs.class ]"
    :value="inputValue"
    :disabled="disabled"
    autocomplete="off"
    v-on="interactive ? { input: onInput} : { blur: onInput }"
    @keypress.ctrl.enter="onCommit"
  >
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

@Component
export default class TextInput extends Vue {
  @Prop() readonly domId?: string;
  @Prop() readonly disabled?: boolean;
  @Prop() readonly interactive?: boolean;
  @Prop({ required: true }) readonly value!: any;

  inputValue = sanitizeValue(this.value);
  focused = false;

  @Watch('value')
  onDefaultValueChange (newValue: any) {
    if (!this.focused) {
      this.inputValue = sanitizeValue(newValue);
    }
  }

  onInput (event: {target: HTMLInputElement}): void {
    this.$emit('input', event.target.value);
  }

  onCommit () {}
}

function sanitizeValue (value: any): string {
  return value ? String(value) : '';
}
</script>
