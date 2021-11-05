<template>
  <nuxt-link
    :class="$attrs.class"
    :to="`/database/${entity}/${recordId}/edit`"
    :title="$t('db.shared.edit')"
  >
    <b-icon icon="pencil" />
    <slot />
  </nuxt-link>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    entity: { type: String, required: true },
    recordId: { type: String, required: true },
  },
});
</script>
