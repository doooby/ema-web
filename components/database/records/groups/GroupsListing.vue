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
import PrintDateRange from '~/components/toolkit/PrintDateRange.vue';
import RecordId from '~/components/views/application/RecordId.vue';

@Component({
  components: {
    RecordId,
    PrintDateRange,
    RecordAssociations,
    RecordHeader,
    ARecordsListing,
    ARecordLink,
    BRecordLink,
    TextNames,
  },
})
export default class GroupsListing extends Vue {
  @Prop({ default: () => [] }) readonly initialColumns!: Column[];
  @Prop({ default: () => {} }) readonly params!: Params;
  @Prop({ default: undefined }) readonly hideCourse!: boolean;
  @Prop({ default: undefined }) readonly hideSchoolYear!: boolean;

  columns = [
    ...application_record.fillDataTableColumns('groups', [
      { name: 'record', size: 180 },
      (this.hideCourse ? undefined : { name: 'course', size: 200 }),
      { name: 'students_count', size: 150 },
      { name: 'term', size: 200 },
      { name: 'linked_groups', size: 200 },
    ]),
  ];

  filterLinkedGroups (groups) {
    return groups?.filter(group => !group.archived_at);
  }
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
        <div>
          {{ record.name?.[1] }}
        </div>
        <RecordId
          :record="record"
          :path="`/database/groups/${record.id}`"
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
        <div class="text-center">
          {{ record.students?.length ?? 0 }}
        </div>
      </td>
      <td class="pl-1">
        <RecordAssociations
          v-if="!hideCourse && record.school_year"
          :record="record"
          :associations="[
            { entity: 'school_years', attr: 'school_year' },
          ]"
        />
        <div v-if="record.term_info">
          <div class="font-12 text-muted">
            <t value="db.record.groups.caption.term" />
            <span>: </span>
            {{ record.term_info[0] }}
          </div>
          <PrintDateRange
            v-if="record.term_dates"
            :dates="record.term_dates"
          />
        </div>
        <div v-else class="mt-1">
          <t value="db.record.groups.caption.is_non_classified" />
        </div>
      </td>
      <td class="pl-1">
        <div v-if="record.parent">
          <div class="font-12 text-muted">
            <t value="db.record.groups.caption.parent_group" />
          </div>
          <RecordId
            class="font-14"
            :record="record.parent"
            :path="`/database/groups/${record.parent.id}`"
          />
        </div>
        <div v-else-if="filterLinkedGroups(record.linked_groups)?.length">
          <div class="font-12 text-muted">
            <t value="db.record.groups.caption.linked_groups" />
            <span>: </span>
            {{ filterLinkedGroups(record.linked_groups).length }}
          </div>
        </div>
      </td>
      <td />
    </template>
  </a-records-listing>
</template>
