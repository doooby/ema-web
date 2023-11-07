<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class TextArea extends Vue {
  @Prop() readonly domId?: string;
  @Prop() readonly disabled?: boolean;
  @Prop() readonly value?: string;

  onChange (event: { target: HTMLInputElement }): void {
    this.invokeChange(event.target.value);
  }

  onSubmit (event: { target: HTMLInputElement }): void {
    this.invokeChange(event.target.value);
    this.$emit('submit');
  }

  invokeChange (newValue) {
    if (newValue !== this.value) this.$emit('change', newValue);
  }
}
</script>

<template>
  <textarea
    :id="domId"
    :class="[ 'form-control', $attrs.class ]"
    :value="value"
    :disabled="disabled"
    @blur="onChange"
    @keypress.ctrl.enter.stop="onSubmit"
  />
</template>
