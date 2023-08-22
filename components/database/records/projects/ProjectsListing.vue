<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ARecordLink from '~/components/database/components/ARecordLink.vue';
import TextNames from '~/components/database/components/TextNames.vue';
import ARecordsListing from '~/components/database/components/listing/ARecordsListing/ARecordsListing.vue';
import { Params } from '~/lib/api2';
import { application_record } from '~/lib/records';
import { Column } from '~/components/DataTable/v3';

@Component({
  components: { ARecordsListing, ARecordLink, TextNames },
})
export default class RecordsListing extends Vue {
  @Prop({ default: () => [] }) readonly initialColumns!: Column[];
  @Prop({ default: () => {} }) readonly params!: Params;

  columns = [
    { name: 'id', size: 80 },
    ...application_record.fillDataTableColumns('projects', [
      { name: 'code' },
      { name: 'name' },
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
    <template #record-actions="{ record }">
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
        <a-record-link :id="record.id" entity="projects" />
      </td>
      <td>
        {{ record.code }}
      </td>
      <td>
        <text-names class="single-row-cell" :value="record.name" />
      </td>
      <td>
        {{ record.short_name_en }}
      </td>
      <td />
    </template>
  </a-records-listing>
</template>
