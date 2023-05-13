<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ARecordLink from '~/components/database/components/ARecordLink.vue';
import TextNames from '~/components/database/components/TextNames.vue';
import ARecordsListing from '~/components/database/components/listing/ARecordsListing.vue';
import { Params } from '~/lib/api2';
import { application_record } from '~/lib/records';
import { Column } from '~/components/DataTable/v3';
import BRecordLink from '~/components/database/components/BRecordLink.vue';
import HeaderCell from '~/components/database/records/courses/HeaderCell.vue';

@Component({
  components: { HeaderCell, BRecordLink, ARecordsListing, ARecordLink, TextNames },
})
export default class RecordsListing extends Vue {
  @Prop({ default: () => [] }) readonly initialColumns!: Column[];
  @Prop({ default: () => {} }) readonly params!: Params;
  @Prop({ default: undefined }) readonly hideSchool!: boolean;

  columns = [
    { name: 'course', size: 240 },
    ...application_record.fillDataTableColumns('courses', [
      { name: 'grade', size: 120 },
    ]),
  ];
}
</script>

<template>
  <a-records-listing
    :class="$attrs.class"
    entity="courses"
    :initial-columns="initialColumns"
    :columns="columns"
    :params="params"
    @change="$emit('change', $event)"
  >
    <template #row="{ record }">
      <td>
        <header-cell :record="record" :hide-school="hideSchool" />
      </td>
      <td class="text-center">
        {{ record.grade }}
      </td>
      <td />
    </template>
  </a-records-listing>
</template>
