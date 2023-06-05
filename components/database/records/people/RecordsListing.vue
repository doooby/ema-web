<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ARecordLink from '~/components/database/components/ARecordLink.vue';
import TextNames from '~/components/database/components/TextNames.vue';
import ARecordsListing from '~/components/database/components/listing/ARecordsListing.vue';
import { Params } from '~/lib/api2';
import { Column } from '~/components/DataTable/v3';
import { application_record } from '~/lib/records';

@Component({
  components: { ARecordsListing, ARecordLink, TextNames },
})
export default class RecordsListing extends Vue {
  @Prop({ default: () => [] }) readonly initialColumns!: Column[];
  @Prop({ default: () => {} }) readonly params!: Params;

  columns = [
    { name: 'id', size: 80 },
    ...application_record.fillDataTableColumns('people', [
      { name: 'student_kobo_no' },
      { name: 'first_name' },
      { name: 'last_name' },
      { name: 'born_on' },
    ]),
  ];
}
</script>

<template>
  <a-records-listing
    :class="$attrs.class"
    entity="people"
    :initial-columns="initialColumns"
    :columns="columns"
    :params="params"
    @change="$emit('change', $event)"
  >
    <template #row="{ record }">
      <td>
        <div class="text-center">
          <a-record-link :id="record.id" entity="people" />
        </div>
      </td>
      <td>
        {{ record.external_id || record.student_kobo_no }}
        <br>
        {{ record.navision_id }}
      </td>
      <td>
        <text-names class="single-row-cell" :value="record.first_name" />
      </td>
      <td>
        <text-names class="single-row-cell" :value="record.last_name" />
      </td>
      <td>
        <span v-if="record.born_on">{{ $d(record.born_on) }}</span>
      </td>
      <td />
    </template>
    <template #footer>
      <slot name="footer" />
    </template>
  </a-records-listing>
</template>
