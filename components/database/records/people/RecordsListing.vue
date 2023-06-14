<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ARecordLink from '~/components/database/components/ARecordLink.vue';
import TextNames from '~/components/database/components/TextNames.vue';
import ARecordsListing from '~/components/database/components/listing/ARecordsListing.vue';
import { Params } from '~/lib/api2';
import { Column } from '~/components/DataTable/v3';
import { application_record } from '~/lib/records';
import BRecordLink from '~/components/database/components/BRecordLink.vue';
import RecordAssociations from '~/components/database/components/listing/RecordAssociations.vue';

@Component({
  components: { RecordAssociations, BRecordLink, ARecordsListing, ARecordLink, TextNames },
})
export default class RecordsListing extends Vue {
  @Prop({ default: () => [] }) readonly initialColumns!: Column[];
  @Prop({ default: () => {} }) readonly params!: Params;

  columns = [
    { name: 'id', size: 80 },
    ...application_record.fillDataTableColumns('people', [
      { name: 'ids' },
      { name: 'person' },
      { name: 'main_group' },
      { name: 'main_contract' },
    ]),
  ];

  mainGroupAssociations = [
    { entity: 'groups', attr: 'main_group.group' },
    { entity: 'courses', attr: 'main_group.course' },
    { entity: 'schools', attr: 'main_group.school' },
  ]

  mainContractAssociations = [
    { entity: 'work_agreements', attr: 'main_contract.work_agreement' },
    { entity: 'donors', attr: 'main_contract.donor' },
    { entity: 'schools', attr: 'main_contract.school' },
  ]
}
</script>

<template>
  <a-records-listing
    :class="$attrs.class"
    entity="people"
    :initial-columns="initialColumns"
    :columns="columns"
    :params="params"
    @change="$emit('change', $event)"
  >
    <template #row="{ record }">
      <td>
        <div class="text-center">
          <a-record-link :id="record.id" entity="people" />
        </div>
      </td>
      <td>
        {{ record.external_id || record.student_kobo_no }}
        <br>
        {{ record.navision_id }}
      </td>
      <td>
        <div>
          <span>{{ record.first_name[0] }}</span>
          <span v-if="record.last_name"> {{ record.last_name[0] }}</span>
        </div>
        <div>
          {{ record.first_name[1] }}
          <span v-if="record.last_name"> {{ record.last_name[1] }}</span>
        </div>
        <div v-if="record.born_on">
          {{ $d(record.born_on) }}
        </div>
      </td>
      <td>
        <RecordAssociations
          :record="record"
          :associations="mainGroupAssociations"
        />
      </td>
      <td>
        <RecordAssociations
          :record="record"
          :associations="mainContractAssociations"
        />
        <div
          v-if="record.main_contract && record.main_contract.position"
          class="font-12"
        >
          <small class="text-muted">
            <t value="db.record.work_agreements.label.position" />
          </small>
          <br>
          <t :value="`app.internal_lists.contract_positions.${record.main_contract.position}`" />
        </div>
      </td>
      <td />
    </template>
    <template #footer>
      <slot name="footer" />
    </template>
  </a-records-listing>
</template>
