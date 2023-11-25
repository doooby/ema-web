<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class RowHeader extends Vue {
  @Prop({ required: true }) readonly record!: unknown;

  get isSelected () {
    return false;
  }

  get showSelect () {
    return false;
  }

  get showMenu () {
    return !!this.$scopedSlots.menu;
  }
}
</script>

<template>
  <div class="d-flex flex-column align-items-center">
    <b-button
      v-if="showSelect"
      variant="outline-secondary"
      size="xs"
      @click="$emit('select')"
    >
      <b-icon v-if="isSelected" icon="check" />
      <div v-else class="blank-icon" />
    </b-button>
    <div
      v-if="showSelect && showMenu"
      class="mb-2"
    />
    <b-dropdown
      v-if="showMenu"
      no-caret
      variant="link"
      dropright
      size="sm"
      toggle-class="p-0"
    >
      <template #button-content>
        <b-icon class="text-muted" icon="list" />
      </template>
      <slot name="menu" :record="record" />
    </b-dropdown>
  </div>
</template>

<style scoped>
.blank-icon {
  width: 1rem;
  height: 1rem;
}
</style>
