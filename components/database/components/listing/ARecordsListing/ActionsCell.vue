<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class ActionsCell extends Vue {
  @Prop({ required: true }) readonly selectable!: boolean;
  @Prop({ required: true }) readonly selected!: boolean;
}
</script>

<template>
  <div class="d-flex flex-column align-items-center">
    <b-button
      v-if="selectable"
      variant="outline-secondary"
      size="xs"
      @click="$emit('select')"
    >
      <b-icon v-if="selected" icon="check" />
      <div v-else class="blank-icon" />
    </b-button>
    <div
      v-if="selectable && $scopedSlots.actions"
      class="mb-2"
    />
    <b-dropdown
      v-if="$scopedSlots.actions"
      no-caret
      variant="link"
      dropright
      size="sm"
      toggle-class="p-0"
    >
      <template #button-content>
        <b-icon class="text-muted" icon="list" />
      </template>
      <slot name="actions" />
    </b-dropdown>
  </div>
</template>

<style scoped>
.blank-icon {
  width: 1rem;
  height: 1rem;
}
</style>
