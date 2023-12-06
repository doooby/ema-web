<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ARecordLink from '~/components/database/components/ARecordLink.vue';
import TextNames from '~/components/database/components/TextNames.vue';
import ARecordsListing from '~/components/database/components/listing/ARecordsListing/ARecordsListing.vue';
import { Params } from '~/lib/api2';
import { application_record, person } from '~/lib/records';
import BRecordLink from '~/components/database/components/BRecordLink.vue';
import RecordAssociations from '~/components/database/components/listing/RecordAssociations.vue';
import PrintFullName from '~/components/database/records/people/PrintFullName.vue';
import PrintDate from '~/components/toolkit/PrintDate.vue';
import RecordNamedValue from '~/components/views/application/RecordNamedValue.vue';
import RecordId from '~/components/views/application/RecordId.vue';
import RecordListingDetails from '~/components/database/records/people/RecordListingDetails.vue';

@Component({
  components: { RecordListingDetails, RecordId, RecordNamedValue, PrintDate, PrintFullName, RecordAssociations, BRecordLink, ARecordsListing, ARecordLink, TextNames },
})
export default class PeopleListing extends Vue {
  @Prop({ default: () => {} }) readonly params!: Params;
  @Prop({ default: undefined }) readonly hideDetails!: boolean;
  @Prop({ default: undefined }) readonly hideGroup!: boolean;
  @Prop({ default: undefined }) readonly hideContract!: boolean;

  columns = [
    { name: 'id', size: 80 },
    ...application_record.fillDataTableColumns('people', [
      { name: 'ids' },
      { name: 'person' },
      (this.hideDetails ? undefined : { name: 'details' }),
      (this.hideGroup ? undefined : { name: 'main_group' }),
      (this.hideContract ? undefined : { name: 'main_contract' }),
    ]),
  ];

  mainGroupAssociations = person.mainGroupAssociations();
  mainContractAssociations = person.mainContractAssociations();
}
</script>

<template>
  <a-records-listing
    :class="$attrs.class"
    entity="people"
    :columns="columns"
    :params="params"
    :default-sort="[ [ 'first_name_lo', 'asc' ] ]"
    @connect="$emit('connect', $event)"
  >
    <template
      v-if="$admission.can('people.update')"
      #record-actions="{ record }"
    >
      <b-dropdown-item :to="`/database/people/${record.id}/edit`">
        <b-icon icon="pencil" />
        <t value="db.page.edit.action" />
      </b-dropdown-item>
    </template>
    <template v-if="$scopedSlots['group-actions']" #group-actions="{ records }">
      <slot name="group-actions" :records="records" />
    </template>
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
        <PrintFullName :person="record" />
        <div class="d-flex justify-content-between align-items-center">
          <small class="mr-2">
            <t
              v-if="record.gender"
              class="text-muted"
              :value="`app.internal_lists.gender.${record.gender}`"
            />
          </small>
          <span v-if="record.born_on" class="mr-3">
            <PrintDate :value="record.born_on" />
          </span>
        </div>
      </td>
      <td v-if="!hideDetails">
        <RecordListingDetails :person="record" />
      </td>
      <td v-if="!hideGroup">
        <RecordAssociations
          :record="record"
          :associations="mainGroupAssociations"
        />
        <RecordNamedValue
          v-if="record.main_group?.dropout"
          class="font-12"
        >
          <template #label>
            <t value="db.record.people.main_group.dropout" />
          </template>
          <PrintDate :value="record.main_group.dropout" />
        </RecordNamedValue>
      </td>
      <td v-if="!hideContract">
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
