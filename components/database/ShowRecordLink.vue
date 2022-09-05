<template>
  <nuxt-link
    :class="$attrs.class"
    :to="`/database/${entity}/${record.id}`"
  >
    <b-icon icon="card-heading" variant="primary" />
    {{ record.caption }}
  </nuxt-link>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class ShowRecordLink extends Vue {
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ required: true }) readonly record!: { id: number, caption: string };
}
</script>
