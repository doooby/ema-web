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
    ...application_record.fillDataTableColumns('courses', [
      { name: 'grade', size: 80 },
      { name: 'name' },
      { name: 'school', size: 300 },
      { name: 'education_level' },
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
        <a-record-link :id="record.id" entity="courses" />
      </td>
      <td>
        {{ record.grade }}
      </td>
      <td>
        <text-names class-name="single-row-cell" :value="record.name" />
      </td>
      <td>
        <b-record-link entity="schools" :record="record.school" />
      </td>
      <td>
        <b-record-link entity="education_levels" :record="record.education_level" />
      </td>
      <td />
    </template>
  </a-records-listing>
</template>
