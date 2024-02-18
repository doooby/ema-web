<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ARecordsListing from '~/components/database/components/listing/ARecordsListing/ARecordsListing.vue';
import { Params } from '~/lib/api2';
import { application_record, school } from '~/lib/records';
import { Column } from '~/components/DataTable/v3';
import RecordHeader from '~/components/database/components/listing/RecordHeader.vue';
import RecordAssociations from '~/components/database/components/listing/RecordAssociations.vue';
import PrintCourseTerms from '~/components/database/records/courses/PrintCourseTerms.vue';
import RecordId from '~/components/views/application/RecordId.vue';
import HeaderCell from '~/components/views/application/pages/index/HeaderCell.vue';

@Component({
  components: {
    HeaderCell,
    RecordId,
    PrintCourseTerms,
    RecordAssociations,
    RecordHeader,
    ARecordsListing,
  },
})
export default class CoursesListing extends Vue {
  @Prop({ default: () => [] }) readonly initialColumns!: Column[];
  @Prop({ default: () => {} }) readonly params!: Params;
  @Prop({ default: undefined }) readonly school!: school.School;

  columns = [
    ...application_record.fillDataTableColumns('courses', [
      { name: 'record', size: 240 },
    ]),
    { name: 'associations1', size: 240 },
    { name: 'associations2', size: 240 },
    ...application_record.fillDataTableColumns('courses', [
      { name: 'groups_count' },
      { name: 'term_dates', size: 400 },
    ]),
  ];

  associations1 = [
    { entity: 'school_years', attr: 'school_year' },
    (!this.school && { entity: 'schools', attr: 'school' }),
  ].filter(a => a)

  associations2 = [
    { entity: 'standardized_courses', attr: 'standardized_course' },
  ]

  get paramsWithScope (): Params {
    const params = { ...this.params };
    if (this.school) params.school_id = this.school.id;
    return params;
  }
}
</script>

<template>
  <a-records-listing
    :class="$attrs.class"
    entity="courses"
    :initial-columns="initialColumns"
    :columns="columns"
    :params="paramsWithScope"
    @change="$emit('change', $event)"
  >
    <template
      v-if="$admission.can('courses.update')"
      #record-actions="{ record }"
    >
      <b-dropdown-item :to="`/database/courses/${record.id}/edit`">
        <b-icon icon="pencil" />
        <t value="db.page.edit.action" />
      </b-dropdown-item>
    </template>
    <template v-if="$scopedSlots['group-actions']" #group-actions="{ records }">
      <slot name="group-actions" :records="records" />
    </template>
    <template #row="{ record }">
      <HeaderCell
        :record="record"
        :path="`/database/courses/${record.id}`"
        :name="record.name?.[1]"
      />
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
      <td>
        <div class="text-center">
          {{ record.groups_count }}
        </div>
      </td>
      <td>
        <PrintCourseTerms :dates="record.term_dates" />
      </td>
      <td />
    </template>
  </a-records-listing>
</template>
