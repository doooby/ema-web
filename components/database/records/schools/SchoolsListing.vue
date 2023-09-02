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
import AssociationList from '~/components/database/components/listing/AssociationList.vue';

@Component({
  components: { AssociationList, RecordHeader, BRecordLink, ARecordsListing, ARecordLink, TextNames },
})
export default class extends Vue {
  @Prop({ default: () => [] }) readonly initialColumns!: Column[];
  @Prop({ default: () => {} }) readonly params!: Params;
  @Prop({ default: undefined }) readonly hideProjects!: boolean;

  columns = [
    { name: 'record', size: 220 },
    ...application_record.fillDataTableColumns('schools', [
      { name: 'external_id' },
      (this.hideProjects ? undefined : { name: 'projects' }),
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
    <template
      v-if="$admission.can('schools.update')"
      #record-actions="{ record }"
    >
      <b-dropdown-item :to="`/database/schools/${record.id}/edit`">
        <b-icon icon="pencil" />
        <t value="db.page.edit.action" />
      </b-dropdown-item>
    </template>
    <template v-if="$scopedSlots['group-actions']" #group-actions="{ records }">
      <slot name="group-actions" :records="records" />
    </template>

    <template #row="{ record }">
      <td>
        <RecordHeader entity="schools" :record="record" />
      </td>
      <td>
        {{ record.external_id }}
      </td>
      <td v-if="!hideProjects">
        <AssociationList entity="projects" :records="record.projects" />
      </td>
      <td>
        <b-record-link v-if="record.director" entity="people" :record="record.director" />
      </td>
      <td />
    </template>
  </a-records-listing>
</template>
