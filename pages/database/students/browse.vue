<template>
  <browse-page
    entity="students"
    :search-fields="searchFields"
    :table-columns="tableColumns"
  >
    <template #actions="{ dataItem }">
      <record-actions-cell
        entity="students"
        :record="dataItem"
        :edit="true"
      />
    </template>
  </browse-page>
</template>

<script lang="ts">
import Vue from 'vue';
import { formatISO } from 'date-fns';
import BrowsePage from '~/components/database/BrowsePage.vue';
import RecordActionsCell from '~/components/database/RecordActionsCell.vue';
import { Student, student } from '~/lib/records';

export default Vue.extend({
  components: { RecordActionsCell, BrowsePage },
  layout: 'database',
  data () {
    return {
      searchFields: [
        { name: 'name', control: 'text' },
      ],
      tableColumns: [
        { name: 'actions', slot: 'actions', headerText: false, size: 40 },
        { name: 'id', cell: { type: 'link', entity: 'students' }, size: 60 },
        { name: 'first_name_en' },
        { name: 'last_name_en' },
        { name: 'first_name' },
        { name: 'last_name' },
        { name: 'born_on', getText: ({ born_on }: Student) => formatDate(born_on) },
        { name: 'gender', getText: (student: Student) => (this as any).translateGender(student.gender) },
        { name: 'language' },
        { name: 'address' },
        { name: 'residency' },
        { name: 'distance_school_km' },
        { name: 'distance_school_time' },
        { name: 'caregivers_en', getText: (student: Student) => student.caregivers_en?.join(', ') },
        { name: 'caregivers', getText: (student: Student) => student.caregivers_en?.join(', ') },
        { name: 'caregivers_contact' },
        { name: 'caregivers_cfw', getText: student.caregivers_cfwToText },
        { name: 'out_of_school' },
        { name: 'enrolment_on', getText: ({ enrolment_on }: Student) => formatDate(enrolment_on) },
        { name: 'completion_on', getText: ({ completion_on }: Student) => formatDate(completion_on) },
        { name: 'dropped_out_on', getText: ({ dropped_out_on }: Student) => formatDate(dropped_out_on) },
        { name: 'drop_out_reason' },
        { name: 'disability', getText: student.disabilityToText },
      ],
    };
  },
  methods: {
    translateGender (gender?: string): string {
      switch (gender) {
        case 'f': return this.$t('gender.f') as string;
        case 'm': return this.$t('gender.m') as string;
        default: return this.$t('gender.other') as string;
      }
    },
  },
});

function formatDate (date?: Date): string {
  if (!date) return '';
  return formatISO(date, { representation: 'date' });
}

</script>
