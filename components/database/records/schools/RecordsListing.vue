<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ARecordLink from '~/components/database/components/ARecordLink.vue';
import TextNames from '~/components/database/components/TextNames.vue';
import ARecordsListing from '~/components/database/components/listing/ARecordsListing.vue';
import { Params } from '~/lib/api2';
import { application_record } from '~/lib/records';
import { Column } from '~/components/DataTable/v3';
import BRecordLink from '~/components/database/components/BRecordLink.vue';

@Component({
  components: { BRecordLink, ARecordsListing, ARecordLink, TextNames },
})
export default class extends Vue {
  @Prop({ default: () => [] }) readonly initialColumns!: Column[];
  @Prop({ default: () => {} }) readonly params!: Params;

  columns = [
    { name: 'id', size: 80 },
    ...application_record.fillDataTableColumns('schools', [
      { name: 'external_id' },
      { name: 'name', size: 300 },
      { name: 'director' },
    ]),
  ];
}
</script>

<template>
  <a-records-listing
    :class="$attrs.class"
    entity="schools"
    :initial-columns="initialColumns"
    :columns="columns"
    :params="params"
    @change="$emit('change', $event)"
  >
    <template #row="{ record }">
      <td>
        <a-record-link :id="record.id" entity="schools" />
      </td>
      <td>
        {{ record.external_id }}
      </td>
      <td>
        <text-names class-name="single-row-cell" :value="record.name" />
      </td>
      <td>
        <b-record-link v-if="record.director" entity="people" :record="record.director" />
      </td>
      <td />
    </template>
  </a-records-listing>
</template>
