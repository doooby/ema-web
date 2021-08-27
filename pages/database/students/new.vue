<template>
  <new-page
    entity="students"
    :fields="fields"
    :no-default-redirect="true"
    @created="onCreated"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import NewPage from '~/components/database/NewPage.vue';
import { student } from '~/lib/records';
import AssigntToCourseControl from '~/components/database/pages/students/AssigntToCourseControl.vue';

export default Vue.extend({
  components: { NewPage },
  layout: 'database',
  computed: {
    fields () {
      return [
        [ 'country', 'associatedRecord', { entity: 'countries' } ],
        [ 'first_name_en', 'text', { leftLabel: () => { return this.$t('misc.language.en') as string; } } ],
        [ 'last_name_en', 'text', { leftLabel: () => { return this.$t('misc.language.en') as string; } } ],
        [ 'first_name', 'text' ],
        [ 'last_name', 'text' ],
        [ 'born_on', 'date' ],
        [ 'gender', 'list', { options: student.genderOptions } ],
        [ 'language', 'text' ],
        [ 'residency', 'list', { options: student.residencyOptions } ],
        [ 'region', 'text' ],
        [ 'address', 'text' ],
        [ 'distance_school_km', 'list', { options: student.distanceToSchool } ],
        [ 'distance_school_time', 'text', { rightLabel: () => { return this.$t('misc.time.min') as string; } } ],
        [ 'transportation', 'list', { options: student.typeOfTransportationOptions } ],
        [ 'mother_first_name_en', 'text', { leftLabel: () => { return this.$t('misc.language.en') as string; } } ],
        [ 'mother_last_name_en', 'text', { leftLabel: () => { return this.$t('misc.language.en') as string; } } ],
        [ 'mother_first_name', 'text' ],
        [ 'mother_last_name', 'text' ],
        [ 'father_first_name_en', 'text', { leftLabel: () => { return this.$t('misc.language.en') as string; } } ],
        [ 'father_last_name_en', 'text', { leftLabel: () => { return this.$t('misc.language.en') as string; } } ],
        [ 'father_first_name', 'text' ],
        [ 'father_last_name', 'text' ],
        [ 'caregiver_first_name_en', 'text', { leftLabel: () => { return this.$t('misc.language.en') as string; } } ],
        [ 'caregiver_last_name_en', 'text', { leftLabel: () => { return this.$t('misc.language.en') as string; } } ],
        [ 'caregiver_first_name', 'text' ],
        [ 'caregiver_last_name', 'text' ],
        [ 'caregiver_id', 'text' ],
        [ 'caregiver_contact', 'text' ],
        [ 'caregiver_cfw', 'list', { options: [ 'yes', 'no' ].map(value => ({ value, caption: value })) } ],
        [ 'caregiver_humansis', 'text' ],
        [ 'disability', 'list', { options: student.disabilityOptions } ],
        [ 'disability_diagnosis', 'list', { options: student.disabilityDiagnosis } ],
        [ 'assistance_needed', 'selectMultiple', { options: student.assistanceNeededOptions } ],
        [ 'oos_before', 'integer', { rightLabel: () => 'months' } ],
        [ 'enrolment_on', 'date', { deletable: true } ],
        [ 'assign_to_course', 'custom', { control: AssigntToCourseControl } ],
      ];
    },
  },
  methods: {
    onCreated (recordId: Number) {
      this.$router.push({ path: `/database/students/${recordId}` });
    },
  },
});
</script>
