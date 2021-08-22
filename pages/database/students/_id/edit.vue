<template>
  <edit-page
    entity="students"
    :fields="fields"
    :no-default-redirect="true"
    @success="onSuccess"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import EditPage from '~/components/database/EditPage.vue';
import DisabilityField from '~/components/database/pages/students/DisabilityField.vue';

const genderOptions = [
  { value: 'female', caption: 'Female' },
  { value: 'male', caption: 'Male' },
  { value: 'other', caption: 'Other' },
];

const residencyStatusOptions = [
  'Resident', 'IDP', 'Host', 'Resettled', 'Returnee', 'Unknown',
].map(value => ({ value, caption: value }));

export default Vue.extend({
  components: { EditPage },
  layout: 'database',
  computed: {
    fields () {
      return [
        { name: 'first_name_en', control: 'text', labels: { right: this.$t('misc.language.en') as string } },
        { name: 'last_name_en', control: 'text', labels: { right: this.$t('misc.language.en') as string } },
        { name: 'first_name', control: 'text' },
        { name: 'last_name', control: 'text' },
        { name: 'gender', control: { type: 'list', options: genderOptions } },
        { name: 'born_on', control: 'date' },
        // language - list
        { name: 'language', control: 'text' },
        { name: 'address', control: 'text' },
        { name: 'residency', control: { type: 'list', options: residencyStatusOptions } },
        { name: 'distance_school_km', control: 'integer', labels: { right: this.$t('misc.distance.km') as string } },
        { name: 'distance_school_time', control: 'integer', labels: { right: this.$t('misc.time.min') as string } },
        // caregivers - maybe just text?
        { name: 'caregivers_contact', control: 'text' },
        // caregivers_cfw
        // out_of_school - list
        { name: 'out_of_school', control: 'integer', labels: { right: this.$t('misc.time.min') as string } },
        { name: 'enrolment_on', control: 'date', data: { deletable: true } },
        { name: 'completion_on', control: 'date', data: { deletable: true } },
        { name: 'dropped_out_on', control: 'date', data: { deletable: true } },
        // drop_out_reason - conditional, list?
        { name: 'drop_out_reason', control: 'text' },
        { name: 'disability', control: { type: 'custom', component: DisabilityField } },
        // required dissability
        // textove pole pro poznamky?
        // priradit ke groupe? tj. vyber skolu, kurz
      ];
    },
  },
  methods: {
    onSuccess (recordId: Number) {
      this.$router.push({ path: `/database/students/${recordId}` });
    },
  },
});
</script>
