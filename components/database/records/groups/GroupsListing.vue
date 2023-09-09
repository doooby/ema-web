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

@Component({
  components: { RecordAssociations, RecordHeader, ARecordsListing, ARecordLink, BRecordLink, TextNames },
})
export default class GroupsListing extends Vue {
  @Prop({ default: () => [] }) readonly initialColumns!: Column[];
  @Prop({ default: () => {} }) readonly params!: Params;
  @Prop({ default: undefined }) readonly hideCourse!: boolean;

  columns = [
    { name: 'record', size: 180 },
    ...application_record.fillDataTableColumns('groups', [
      { name: 'term', size: 80 },
      (this.hideCourse ? undefined : { name: 'course', size: 200 }),
    ]),
  ];

  courseAssociations = [
    { entity: 'courses', attr: 'course' },
    { entity: 'schools', attr: 'school' },
  ]
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
      <td>
        {{ record.term }}
      </td>
      <td v-if="!hideCourse">
        <RecordAssociations
          :record="record"
          :associations="courseAssociations"
        />
      </td>
      <td />
    </template>
  </a-records-listing>
</template>
