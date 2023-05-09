<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class RecordSelectionCell extends Vue {
  @Prop({ required: true }) readonly selected!: boolean;
  @Prop({ required: true }) readonly record!: any;
}
</script>

<template>
  <div class="d-flex align-items-center pl-1">
    <b-button
      variant="outline-secondary"
      size="xs"
      @click="$emit('change')"
    >
      <b-icon v-if="selected" icon="check" />
      <div v-else class="--empty" />
    </b-button>
  </div>
</template>

<style>
.--empty {
  width: 1rem;
  height: 1rem;
}
</style>
