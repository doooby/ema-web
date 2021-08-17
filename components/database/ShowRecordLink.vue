<template>
  <nuxt-link
    :class="$attrs.class"
    :to="`/database/${entity}/${recordId}`"
    :title="$t('db.shared.show')"
  >
    <b-icon icon="card-heading" variant="primary" />
    <slot />
  </nuxt-link>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    entity: { type: String, required: true },
    recordId: { type: Number, required: true },
  },
});
</script>
