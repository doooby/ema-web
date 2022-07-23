<template>
  <b-button
    :variant="variantInternal"
    :disabled="disabled"
    class="btn-xs"
    @click="onClick"
  >
    <b-icon :icon="icon" />
  </b-button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class BtnMini extends Vue {
  @Prop({ required: true }) readonly variant!: string;
  @Prop({ required: true }) readonly icon!: string;
  @Prop({ default: () => undefined }) readonly disabled?: boolean;

  get variantInternal (): string {
    return `outline-${this.variant}`;
  }

  onClick () {
    this.$emit('click');
  }
}
</script>
