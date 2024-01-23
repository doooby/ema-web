<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class PageTab extends Vue {
  @Prop({ required: true }) readonly id!: number;
  @Prop({ required: true }) readonly value!: number;
}
</script>

<template>
  <b-tab
    @click="$emit('input', id)"
  >
    <template #title>
      <slot name="title" />
    </template>
    <slot name="content" :present="id === value">
      <slot />
    </slot>
  </b-tab>
</template>
