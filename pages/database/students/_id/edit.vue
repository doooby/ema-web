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
import { FormField } from '~/components/Form';
import DisabilityField from '~/components/database/pages/students/DisabilityField.vue';

export default Vue.extend({
  components: { EditPage },
  layout: 'database',
  computed: {
    fields (): FormField[] {
      return [
        { name: 'first_name_en', control: 'text', labels: { right: this.$t('misc.language.en') as string } },
        { name: 'last_name_en', control: 'text', labels: { right: this.$t('misc.language.en') as string } },
        { name: 'first_name', control: 'text' },
        { name: 'last_name', control: 'text' },
        { name: 'born_on', control: 'date' },
        { name: 'language', control: 'text' },
        { name: 'address', control: 'text' },
        { name: 'residency', control: 'text' },
        { name: 'distance_school_km', control: 'integer', labels: { right: this.$t('misc.distance.km') as string } },
        { name: 'distance_school_time', control: 'integer', labels: { right: this.$t('misc.time.min') as string } },
        // caregivers
        { name: 'caregivers_contact', control: 'text' },
        // caregivers_cfw
        { name: 'out_of_school', control: 'integer', labels: { right: this.$t('misc.time.min') as string } },
        { name: 'enrolment_on', control: 'date', data: { deletable: true } },
        { name: 'completion_on', control: 'date', data: { deletable: true } },
        { name: 'dropped_out_on', control: 'date', data: { deletable: true } },
        { name: 'drop_out_reason', control: 'text' },
        { name: 'disability', control: { type: 'custom', component: DisabilityField } },
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
