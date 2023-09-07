<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class TextInput extends Vue {
  @Prop() readonly domId?: string;
  @Prop() readonly disabled?: boolean;
  @Prop() readonly value?: string;

  onChange (event: { target: HTMLInputElement }): void {
    this.$emit('change', event.target.value);
  }

  onSubmit (event: { target: HTMLInputElement }): void {
    this.$emit('change', event.target.value);
    this.$emit('submit', event.target.value);
  }
}
</script>

<template>
  <input
    :id="domId"
    type="text"
    :class="[ 'form-control', $attrs.class ]"
    :value="value"
    :disabled="disabled"
    autocomplete="off"
    @blur="onChange"
    @keypress.enter.stop="onSubmit"
  >
</template>
