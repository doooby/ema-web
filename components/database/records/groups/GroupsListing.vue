<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ARecordLink from '~/components/database/components/ARecordLink.vue';
import TextNames from '~/components/database/components/TextNames.vue';
import ARecordsListing from '~/components/database/components/listing/ARecordsListing/ARecordsListing.vue';
import { Params } from '~/lib/api2';
import { application_record } from '~/lib/records';
import { Column } from '~/components/DataTable/v3';
import BRecordLink from '~/components/database/components/BRecordLink.vue';

@Component({
  components: { ARecordsListing, ARecordLink, BRecordLink, TextNames },
})
export default class RecordsListing extends Vue {
  @Prop({ default: () => [] }) readonly initialColumns!: Column[];
  @Prop({ default: () => {} }) readonly params!: Params;
  @Prop({ default: undefined }) readonly hideSchool!: boolean;
  @Prop({ default: undefined }) readonly hideCourse!: boolean;

  columns = [
    { name: 'id', size: 80 },
    ...application_record.fillDataTableColumns('groups', [
      (this.hideCourse ? undefined : { name: 'course' }),
      { name: 'term', size: 80 },
      { name: 'name' },
      (this.hideSchool ? undefined : { name: 'school', size: 300 }),
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
        <a-record-link :id="record.id" entity="groups" />
      </td>
      <td v-if="!hideCourse">
        <b-record-link :record="record.course" entity="courses" />
      </td>
      <td>
        {{ record.term }}
      </td>
      <td>
        <text-names class="single-row-cell" :value="record.name" />
      </td>
      <td v-if="!hideSchool">
        <b-record-link :record="record.school" entity="schools" />
      </td>
      <td />
    </template>
  </a-records-listing>
</template>
