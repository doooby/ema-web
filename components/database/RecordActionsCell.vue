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
        <b-icon-three-dots-vertical />
      </template>
      <slot name="action" :record="record" />
      <b-dropdown-item
        v-if="edit"
        :to="`/database/${entity}/${record.id}/edit`"
      >
        <b-icon-pencil variant="secondary" />
        {{ $t('db.shared.edit') }}
      </b-dropdown-item>
      <b-dropdown-item
        v-for="{ action, icon, iconVariant, t } in actions"
        :key="action"
        :to="`/database/${entity}/${record.id}/${action}`"
      >
        <b-icon :icon="icon" :variant="iconVariant || 'secondary'" />
        {{ $t(t) }}
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { BIconThreeDotsVertical, BIconPencil } from 'bootstrap-vue';

interface Action {
  action: string;
  icon: string;
  iconVariant?: string;
  t: string;
}

export default Vue.extend({
  components: { BIconThreeDotsVertical, BIconPencil },
  props: {
    entity: { type: String, required: true },
    record: { type: Object as Vue.PropType<any>, required: true },
    edit: { type: Boolean, default: false },
    actions: { type: Array as Vue.PropType<Action[]>, default: () => [] },
  },
});
</script>
