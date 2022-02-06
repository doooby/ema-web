<template>
  <div class="d-flex align-items-center">
    <b-dropdown
      no-caret
      variant="link"
      dropright
      size="sm"
      toggle-class="p-0"
    >
      <template #button-content>
        <b-icon icon="three-dots-vertical" />
      </template>
      <b-dropdown-item
        v-for="{ action, icon, t } in actions"
        :key="action"
        :to="`/database/${entity}/${record.id}/${action}`"
      >
        <b-icon :icon="icon" />
        <t :value="t" />
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

export interface Action {
  action: string;
  icon: string;
  t: string;
}

@Component
export default class RecordActions extends Vue {
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ required: true }) readonly record!: any;
  @Prop({ required: true }) readonly actions!: Action[];
}
</script>
