<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ARecordLink from '~/components/database/components/ARecordLink.vue';
import TextNames from '~/components/database/components/TextNames.vue';
import ARecordsListing from '~/components/database/components/listing/ARecordsListing/ARecordsListing.vue';
import { Params } from '~/lib/api2';
import { application_record } from '~/lib/records';
import { Column } from '~/components/DataTable/v3';
import BRecordLink from '~/components/database/components/BRecordLink.vue';
import RecordHeader from '~/components/database/components/listing/RecordHeader.vue';
import RecordAssociations from '~/components/database/components/listing/RecordAssociations.vue';
import PrintGroupTerm from '~/components/database/records/groups/PrintGroupTerm.vue';

@Component({
  components: { PrintGroupTerm, RecordAssociations, RecordHeader, ARecordsListing, ARecordLink, BRecordLink, TextNames },
})
export default class GroupsListing extends Vue {
  @Prop({ default: () => [] }) readonly initialColumns!: Column[];
  @Prop({ default: () => {} }) readonly params!: Params;
  @Prop({ default: undefined }) readonly hideCourse!: boolean;
  @Prop({ default: undefined }) readonly hideSchoolYear!: boolean;

  columns = [
    { name: 'record', size: 180 },
    ...application_record.fillDataTableColumns('groups', [
      (this.hideCourse ? undefined : { name: 'course', size: 200 }),
      { name: 'students_count', size: 200 },
      { name: 'term', size: 200 },
    ]),
  ];
}
</script>

<template>
  <a-records-listing
    :class="$attrs.class"
    entity="groups"
    :initial-columns="initialColumns"
    :columns="columns"
    :params="params"
    @change="$emit('change', $event)"
  >
    <template
      v-if="$admission.can('groups.update')"
      #record-actions="{ record }"
    >
      <b-dropdown-item :to="`/database/groups/${record.id}/edit`">
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
          entity="groups"
          :record="record"
        />
      </td>
      <td v-if="!hideCourse">
        <RecordAssociations
          :record="record"
          :associations="[
            { entity: 'courses', attr: 'course' },
            { entity: 'schools', attr: 'school' },
          ]"
        />
      </td>
      <td>
        {{ record.students?.length ?? 0 }}
      </td>
      <td class="ml-1">
        <RecordAssociations
          v-if="!hideCourse && record.school_year"
          :record="record"
          :associations="[
            { entity: 'school_years', attr: 'school_year' },
          ]"
        />
        <div v-if="record.term_info">
          <div>
            <small>
              <t value="db.record.groups.caption.term" />&nbsp;:
            </small>
            {{ record.term_info[0] }}
          </div>
          <PrintGroupTerm
            v-if="record.term_dates"
            :dates="record.term_dates"
          />
        </div>
        <div v-else class="mt-1">
          <t value="db.record.groups.caption.is_non_classified" />
        </div>
      </td>
      <td />
    </template>
  </a-records-listing>
</template>
