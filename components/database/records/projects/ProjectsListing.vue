<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ARecordLink from '~/components/database/components/ARecordLink.vue';
import TextNames from '~/components/database/components/TextNames.vue';
import ARecordsListing from '~/components/database/components/listing/ARecordsListing/ARecordsListing.vue';
import { Params } from '~/lib/api2';
import { application_record } from '~/lib/records';
import { Column } from '~/components/DataTable/v3';
import AssociationList from '~/components/database/components/listing/AssociationList.vue';
import RecordHeader from '~/components/database/components/listing/RecordHeader.vue';

@Component({
  components: { RecordHeader, AssociationList, ARecordsListing, ARecordLink, TextNames },
})
export default class RecordsListing extends Vue {
  @Prop({ default: () => [] }) readonly initialColumns!: Column[];
  @Prop({ default: () => {} }) readonly params!: Params;

  columns = [
    { name: 'record', size: 220 },
    ...application_record.fillDataTableColumns('projects', [
      { name: 'code' },
      { name: 'donors' },
      { name: 'short_name_en' },
    ]),
  ];
}
</script>

<template>
  <a-records-listing
    :class="$attrs.class"
    entity="projects"
    :initial-columns="initialColumns"
    :columns="columns"
    :params="params"
    @change="$emit('change', $event)"
  >
    <template
      v-if="$admission.can('projects.update')"
      #record-actions="{ record }"
    >
      <b-dropdown-item :to="`/database/projects/${record.id}/edit`">
        <b-icon icon="pencil" />
        <t value="db.page.edit.action" />
      </b-dropdown-item>
    </template>
    <template v-if="$scopedSlots['group-actions']" #group-actions="{ records }">
      <slot name="group-actions" :records="records" />
    </template>
    <template #row="{ record }">
      <td>
        <RecordHeader entity="projects" :record="record" />
      </td>
      <td>
        {{ record.code }}
      </td>
      <td>
        <AssociationList entity="donors" :records="record.donors" />
      </td>
      <td>
        {{ record.short_name_en }}
      </td>
      <td />
    </template>
  </a-records-listing>
</template>
