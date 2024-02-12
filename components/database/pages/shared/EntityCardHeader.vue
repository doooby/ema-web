<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import ARecordLink from '~/components/database/components/ARecordLink.vue';
import { wai } from '~/vendor/wai';
import RecordId from '~/components/views/application/RecordId.vue';

@Component({
  components: { RecordId, ARecordLink },
})
export default class EntityCardHeader extends Vue {
  @Prop() readonly entity?: string;
  @Prop() readonly record?: wai.AResource;
  @Prop() readonly hasShowPage?: boolean;
  @Prop() readonly path?: string;

  get internalPath () {
    if (this.path) return this.path;
    if (this.hasShowPage && this.record) {
      return `/database/${this.entity}/${this.record.id}`;
    }
  }
}
</script>

<template>
  <div class="d-flex flex-wrap justify-content-between align-items-center --component">
    <h2 class="m-0">
      <slot />
      <br v-if="$scopedSlots.default">
      <small v-if="entity" class="text-muted">
        <t :value="`db.record.${entity}.meta.s`" />
      </small>
    </h2>
    <div>
      <RecordId
        v-if="record"
        :record="record"
        :path="internalPath"
        :new-tab="true"
      />
    </div>
  </div>
</template>

<style scoped>
.--component {
  column-gap: 8px;
}
</style>
