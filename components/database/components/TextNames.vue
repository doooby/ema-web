<template>
  <div :class="$attrs.class">
    <slot name="prepend" />
    <span v-if="sanitizedValue[1]">{{ sanitizedValue[1] }}</span>
    <br v-if="sanitizedValue[0] && sanitizedValue[1]">
    <small v-if="sanitizedValue[0]">{{ sanitizedValue[0] }}</small>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class TextNames extends Vue {
  @Prop({ required: true }) readonly value!: string[];

  get sanitizedValue (): string[] {
    return this.value ?? [];
  }
}
</script>
