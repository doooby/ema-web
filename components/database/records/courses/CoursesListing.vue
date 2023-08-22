<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ARecordsListing from '~/components/database/components/listing/ARecordsListing/ARecordsListing.vue';
import { Params } from '~/lib/api2';
import { application_record } from '~/lib/records';
import { Column } from '~/components/DataTable/v3';
import RecordHeader from '~/components/database/components/listing/RecordHeader.vue';
import RecordAssociations from '~/components/database/components/listing/RecordAssociations.vue';

@Component({
  components: {
    RecordAssociations,
    RecordHeader,
    ARecordsListing,
  },
})
export default class RecordsListing extends Vue {
  @Prop({ default: () => [] }) readonly initialColumns!: Column[];
  @Prop({ default: () => {} }) readonly params!: Params;

  columns = [
    { name: 'record', size: 240 },
    { name: 'associations1', size: 240 },
    { name: 'associations2', size: 240 },
    ...application_record.fillDataTableColumns('courses', [
      { name: 'grade', size: 120 },
    ]),
  ];

  associations1 = [
    { entity: 'schools', attr: 'school' },
    { entity: 'projects', attr: 'project' },
  ]

  associations2 = [
    { entity: 'school_years', attr: 'school_year' },
    { entity: 'standardized_courses', attr: 'standardized_course' },
  ]
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
    <template #record-actions="{ record }">
      <b-dropdown-item :to="`/database/courses/${record.id}/edit`">
        <b-icon icon="pencil" />
        <t value="db.page.edit.action" />
      </b-dropdown-item>
    </template>
    <template v-if="$scopedSlots['group-actions']" #group-actions="{ records }">
      <slot name="group-actions" :records="records" />
    </template>
    <template #row="{ record }">
      <td>
        <RecordHeader
          entity="courses"
          :record="record"
        />
      </td>
      <td>
        <RecordAssociations
          :record="record"
          :associations="associations1"
        />
      </td>
      <td>
        <RecordAssociations
          :record="record"
          :associations="associations2"
        />
      </td>
      <td class="text-center">
        {{ record.grade }}
      </td>
      <td />
    </template>
  </a-records-listing>
</template>
