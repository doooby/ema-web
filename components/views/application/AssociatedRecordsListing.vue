<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { wai } from '~/vendor/wai';
import app from '~/lib/app';
import RecordId from '~/components/views/application/RecordId.vue';

@Component({
  components: { RecordId },
})
export default class AssociatedRecordsListing extends Vue {
  @Prop() readonly records?: app.List<wai.AResource>;
  @Prop() readonly showLink?: string;
  @Prop() readonly newTab?: boolean;
}
</script>

<template>
  <div class="AssociatedRecordsListing d-flex flex-wrap">
    <div
      v-for="(record, index) in records ?? []"
      :key="record.id ? record.id : `i:${index}`"
    >
      <slot :record="record" />
    </div>
  </div>
</template>

<style scoped>
.AssociatedRecordsListing {
  gap: 8px;
}
</style>
