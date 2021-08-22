<template>
  <edit-page
    entity="students"
    :fields="fields"
    :no-default-redirect="true"
    @updated="onUpdated"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import EditPage from '~/components/database/EditPage.vue';
// import DisabilityField from '~/components/database/pages/students/DisabilityField.vue';

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
        [ 'first_name_en', 'text', { label: () => { return this.$t('misc.language.en') as string; } } ],
        [ 'last_name_en', 'text', { label: () => { return this.$t('misc.language.en') as string; } } ],
        [ 'first_name', 'text' ],
        [ 'last_name', 'text' ],
        [ 'gender', 'list', { options: genderOptions } ],
        [ 'born_on', 'date' ],
        // language - list
        [ 'language', 'text' ],
        [ 'address', 'text' ],
        [ 'gender', 'residency', { options: residencyStatusOptions } ],
        [ 'distance_school_km', 'text', { rightLabel: () => { return this.$t('misc.language.en') as string; } } ],
        [ 'distance_school_time', 'text', { rightLabel: () => { return this.$t('misc.time.min') as string; } } ],
        // caregivers - maybe just text?
        [ 'caregivers_contact', 'text' ],
        // caregivers_cfw
        // out_of_school - list
        [ 'out_of_school', 'integer', { rightLabel: () => { return this.$t('misc.time.min') as string; } } ],
        [ 'enrolment_on', 'date', { deletable: true } ],
        [ 'completion_on', 'date', { deletable: true } ],
        [ 'dropped_out_on', 'date', { deletable: true } ],
        // drop_out_reason - conditional, list?
        [ 'drop_out_reason', 'text' ],
        // disability
        // [ 'disability', 'custom', { component: DisabilityField } ],
        // required dissability
        // textove pole pro poznamky?
        // priradit ke groupe? tj. vyber skolu, kurz
      ];
    },
  },
  methods: {
    onUpdated (recordId: Number) {
      this.$router.push({ path: `/database/students/${recordId}` });
    },
  },
});
</script>
