<template>
  <nuxt-link
    :to="`/database/${entity}/${recordId}`"
    :title="$t('db.shared.show')"
  >
    <b-icon-card-heading variant="primary" />
    <slot />
  </nuxt-link>
</template>

<script lang="ts">
import Vue from 'vue';
import { BIconCardHeading } from 'bootstrap-vue';

export default Vue.extend({
  components: { BIconCardHeading },
  props: {
    entity: { type: String, required: true },
    recordId: { type: Number, required: true },
  },
});
</script>
