<template>
  <nuxt-link
    :class="$attrs.class"
    :to="`/database/${entity}/${recordId}/edit`"
    :title="$t('db.shared.edit')"
  >
    <b-icon-pencil variant="secondary" />
    <slot />
  </nuxt-link>
</template>

<script lang="ts">
import Vue from 'vue';
import { BIconPencil } from 'bootstrap-vue';

export default Vue.extend({
  components: { BIconPencil },
  props: {
    entity: { type: String, required: true },
    recordId: { type: Number, required: true },
  },
});
</script>
