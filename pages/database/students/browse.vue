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
import RecordCellActions from '~/components/database/RecordCellActions.vue';
import { Student, student } from '~/lib/records';

export default Vue.extend({
  components: { RecordCellActions, BrowsePage },
  layout: 'database',
  data () {
    return {
      searchFields: [
        [ 'name', 'text' ],
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
        { name: 'residency' },
        { name: 'language' },
        { name: 'region' },
        { name: 'address' },
        { name: 'distance_school_km' },
        { name: 'distance_school_time' },
        { name: 'mother_first_name_en' },
        { name: 'mother_last_name_en' },
        { name: 'mother_first_name' },
        { name: 'mother_last_name' },
        { name: 'father_first_name_en' },
        { name: 'father_last_name_en' },
        { name: 'father_first_name' },
        { name: 'father_last_name' },
        { name: 'caregiver_first_name_en' },
        { name: 'caregiver_last_name_en' },
        { name: 'caregiver_first_name' },
        { name: 'caregiver_last_name' },
        { name: 'caregiver_id' },
        { name: 'caregiver_contact' },
        { name: 'caregiver_cfw' },
        { name: 'caregiver_humansis' },
        { name: 'disability' },
        { name: 'disability_diagnosis' },
        { name: 'assistance_needed' },
        { name: 'oos_before' },
        { name: 'enrolment_on', getText: ({ enrolment_on }: Student) => formatDate(enrolment_on) },
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
