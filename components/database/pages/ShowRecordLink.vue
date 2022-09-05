<template>
  <nuxt-link
    :class="$attrs.class"
    :to="`/database/${entity}/${record.id}`"
  >
    <b-icon
      icon="card-heading"
      :variant="invalidRecord ? 'danger' : 'primary'"
      :title="invalidRecord && invalidRecord.error.message"
    />
    {{ caption }}
  </nuxt-link>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import * as mappers from '~/lib/api/mappers';

@Component
export default class ShowRecordLink extends Vue {
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ required: true }) readonly record!: mappers.RecordBase | mappers.InvalidRecord;
  @Prop() readonly caption?: string;

  get invalidRecord (): null | mappers.InvalidRecordDetails {
    return ('__invalidRecord' in this.record && this.record.__invalidRecord) || null;
  }
}
</script>
