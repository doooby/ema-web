<template>
  <nuxt-link
    :class="$attrs.class"
    :to="`/database/${entity}/${record.id}`"
    :title="$t('db.shared.show')"
  >
    <b-icon icon="card-heading" variant="primary" />
    {{ record.caption }}
  </nuxt-link>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  props: {
    entity: { type: String, required: true },
    record: { type: Object as PropType<{ id: number, caption: string }>, required: true },
  },
});
</script>
