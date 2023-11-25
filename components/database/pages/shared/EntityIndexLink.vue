<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class EntityIndexLink extends Vue {
  @Prop() readonly entity?: string;
}
</script>

<template>
  <nuxt-link
    :to="`/database/${entity}`"
  >
    <t :value="`db.record.${entity}.meta.p`" />
  </nuxt-link>
</template>
