<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { wai } from '~/vendor/wai';
import {
  State,
} from '~/components/views/application/RecordsTable/RecordsTableGroupActions.vue';

@Component
export default class RecordsTableRowSelect extends Vue {
  @Prop({ required: true }) state!: State;
  @Prop({ required: true }) record!: wai.AResource;
  @Prop() isLoading?: boolean;
}
</script>

<template>
  <button
    :class="[
      'btn btn-xs btn-outline-secondary',
      $attrs.class,
    ]"
    type="button"
    @click="state.select(record)"
  >
    <b-icon v-if="state.isSelected(record)" icon="check" />
    <span v-else class="d-block blank-icon" />
  </button>
</template>

<style scoped>
.blank-icon {
  width: 1rem;
  height: 1rem;
}
</style>
