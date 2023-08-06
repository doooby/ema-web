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
export default class RecordsListing extends Vue {
  @Prop({ default: () => [] }) readonly initialColumns!: Column[];
  @Prop({ default: () => {} }) readonly params!: Params;

  columns = [
    { name: 'id', size: 80 },
    ...application_record.fillDataTableColumns('school_years', [
      { name: 'name' },
      { name: 'year_label' },
      { name: 'education_levels', size: 400 },
    ]),
  ];
}
</script>

<template>
  <a-records-listing
    :class="$attrs.class"
    entity="school_years"
    :initial-columns="initialColumns"
    :columns="columns"
    :params="params"
    @change="$emit('change', $event)"
  >
    <template #record-actions="{ record }">
      <b-dropdown-item :to="`/database/school_years/${record.id}/edit`">
        <b-icon icon="pencil" />
        <t value="db.page.edit.action" />
      </b-dropdown-item>
    </template>
    <template v-if="$scopedSlots['group-actions']" #group-actions="{ records }">
      <slot name="group-actions" :records="records" />
    </template>
    <template #row="{ record }">
      <td>
        <a-record-link :id="record.id" entity="school_years" />
      </td>
      <td>
        <text-names class="single-row-cell" :value="record.name" />
      </td>
      <td>
        {{ record.year_label }}
      </td>
      <td>
        <div v-for="education_level of record.education_levels" :key="education_level.id">
          <b-record-link entity="education_levels" :record="education_level" />
        </div>
      </td>
      <td />
    </template>
  </a-records-listing>
</template>
