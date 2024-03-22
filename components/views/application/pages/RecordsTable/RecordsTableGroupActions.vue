<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import app from '~/lib/app';
import { wai } from '~/vendor/wai';

export class State {
  selected_idnex: app.Map<wai.AResource> = {};

  isSelectedAll = false;

  get selectedCount () {
    return Object.keys(this.selected_idnex).length;
  }

  get selected () {
    return Object
      .values(this.selected_idnex)
      .filter(self => self?.id?.length) as wai.AResource[];
  }

  isSelected (record: wai.AResource) {
    return !!this.selected_idnex[recordId(record)];
  }

  select (record: wai.AResource) {
    if (!record.id?.length) return;
    this.selected_idnex = { ...this.selected_idnex };
    if (this.isSelected(record)) {
      delete this.selected_idnex[recordId(record)];
    } else {
      this.selected_idnex[recordId(record)] = record;
    }
  }

  toggleAll (records?: wai.AResource[]) {
    this.selected_idnex = {};
    this.isSelectedAll = !this.isSelectedAll;
    if (this.isSelectedAll && records) {
      for (const record of records) {
        this.selected_idnex[recordId(record)] = record;
      }
    }
  }
}

function recordId (record: wai.AResource) {
  return record?.id || '-1';
}

@Component
export default class RecordsTableGroupActions extends Vue {
  @Prop({ required: true }) state!: State;
  @Prop() disabled?: boolean;
  @Prop() records?: app.Maybe<wai.RecordsList['records']>;

  static State = State;
}
</script>

<template>
  <div
    :class="[
      'd-flex align-items-center',
      $attrs.class,
    ]"
  >
    <button
      class="btn btn-xs btn-outline-secondary"
      :disabled="disabled"
      type="button"
      @click="state.toggleAll(records)"
    >
      <b-icon :icon="state.isSelectedAll ? 'x' : 'check-all'" />
    </button>
    <div class="ml-3">
      <b-dropdown
        :disabled="!state.selectedCount"
        toggle-class="py-0"
      >
        <template #button-content>
          <t value="app.RecordsTableGroupAction.count" />
          ({{ state.selectedCount }})
        </template>
        <slot :selected="state.selected" />
      </b-dropdown>
    </div>
  </div>
</template>
