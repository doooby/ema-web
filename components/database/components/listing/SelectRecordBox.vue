<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class SelectRecordBox extends Vue {
  @Prop({ required: true }) readonly selected!: boolean;
  @Prop({ required: true }) readonly record!: any;
}
</script>

<template>
  <div class="px-1">
    <b-button
      variant="outline-secondary"
      size="xs"
      @click="$emit('change', { record, selected: !selected })"
    >
      <b-icon v-if="selected" icon="check" />
      <div v-else class="empty" />
    </b-button>
  </div>
</template>

<style scoped>
.empty {
  width: 1rem;
  height: 1rem;
}
</style>
