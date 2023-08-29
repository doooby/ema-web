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
  components: { ARecordsListing, ARecordLink, TextNames, BRecordLink },
})
export default class extends Vue {
  @Prop({ default: () => [] }) readonly initialColumns!: Column[];
  @Prop({ default: () => {} }) readonly params!: Params;

  get columns (): any {
    return [
      { name: 'id', size: 80 },
      ...application_record.fillDataTableColumns('work_agreements', [
        { name: 'position' },
        { name: 'person' },
        { name: 'school', size: 300 },
        { name: 'validity' },
        { name: 'resigned_on' },
      ]),
    ];
  }
}
</script>

<template>
  <a-records-listing
    :class="$attrs.class"
    entity="work_agreements"
    :initial-columns="initialColumns"
    :columns="columns"
    :params="params"
    @change="$emit('change', $event)"
  >
    <template
      v-if="$admission.can('work_agreements.update')"
      #record-actions="{ record }"
    >
      <b-dropdown-item :to="`/database/work_agreements/${record.id}/edit`">
        <b-icon icon="pencil" />
        <t value="db.page.edit.action" />
      </b-dropdown-item>
    </template>
    <template v-if="$scopedSlots['group-actions']" #group-actions="{ records }">
      <slot name="group-actions" :records="records" />
    </template>
    <template #row="{ record }">
      <td>
        <a-record-link :id="record.id" entity="work_agreements" />
      </td>
      <td>
        <t v-if="record.position" :value="`app.internal_lists.contract_positions.${record.position}`" />
      </td>
      <td>
        <b-record-link entity="people" :record="record.person" />
      </td>
      <td>
        <b-record-link entity="schools" :record="record.school" />
      </td>
      <td>
        <div>
          <span>{{ record.starts_on && $d(record.starts_on) }}</span>
          <span>-</span>
          <span>{{ record.ends_on && $d(record.ends_on) }}</span>
        </div>
      </td>
      <td>
        {{ record.resigned_on && $d(record.resigned_on) }}
      </td>
      <td />
    </template>
  </a-records-listing>
</template>
