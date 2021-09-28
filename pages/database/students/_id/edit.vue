<template>
  <edit-page
    entity="students"
    :fields="fields"
    :no-default-redirect="true"
    @updated="onUpdated"
  >
    <template #layout="{ context, values }">
      <div class="col-md-6 col-xl-4">
        <form-field name="country" :context="context" :values="values" />
      </div>
      <div class="w-100 emb-6"></div>
      <div class="col-md-6 col-xl-4">
        <form-field name="first_name" :context="context" :values="values" />
      </div>
      <div class="col-md-6 col-xl-4">
        <form-field name="last_name" :context="context" :values="values" />
      </div>
      <div class="w-100 emb-6"></div>
      <div class="col-md-6 col-xl-4">
        <form-field name="born_on" :context="context" :values="values" />
        <form-field name="gender" :context="context" :values="values" />
        <form-field name="nationality" :context="context" :values="values" />
        <form-field name="language" :context="context" :values="values" />
      </div>
      <div class="col-md-6 col-xl-4">
        <form-field name="residency" :context="context" :values="values" />
        <form-field name="region" :context="context" :values="values" />
        <form-field name="address" :context="context" :values="values" />
        <form-field name="distance_school_km" :context="context" :values="values" />
        <form-field name="distance_school_time" :context="context" :values="values" />
        <form-field name="transportation" :context="context" :values="values" />
      </div>
      <div class="w-100 emb-6"></div>
      <div class="col-md-6 col-xl-4">
        <form-field name="mother_first_name" :context="context" :values="values" />
        <form-field name="mother_last_name" :context="context" :values="values" />
        <form-field name="father_first_name" :context="context" :values="values" />
        <form-field name="father_last_name" :context="context" :values="values" />
      </div>
      <div class="col-md-6 col-xl-4">
        <form-field name="caregiver_first_name" :context="context" :values="values" />
        <form-field name="caregiver_last_name" :context="context" :values="values" />
        <form-field name="caregiver_relation" :context="context" :values="values" />
        <form-field name="caregiver_id" :context="context" :values="values" />
        <form-field name="caregiver_gender" :context="context" :values="values" />
        <form-field name="caregiver_contact" :context="context" :values="values" />
        <form-field name="caregiver_cfw" :context="context" :values="values" />
        <form-field name="caregiver_humansis" :context="context" :values="values" />
      </div>
      <div class="w-100 emb-6"></div>
      <div class="col-md-6 col-xl-4">
        <form-field name="disability" :context="context" :values="values" />
        <form-field name="disability_diagnosis" :context="context" :values="values" />
        <form-field name="assistance_needed" :context="context" :values="values" />
        <form-field name="oos_before" :context="context" :values="values" />
      </div>
      <div class="col-md-6 col-xl-4">
        <form-field name="enrolment_on" :context="context" :values="values" />
        <form-field name="notes" :context="context" :values="values" />
      </div>
    </template>
  </edit-page>
</template>

<script lang="ts">
import Vue from 'vue';
import EditPage from '~/components/database/EditPage.vue';
import { student } from '~/lib/records';

export default Vue.extend({
  components: { EditPage },
  layout: 'database',
  computed: {
    fields () {
      return [
        ...student.entityControls(this),
      ];
    },
  },
  methods: {
    onUpdated (record: any) {
      this.$router.push({ path: `/database/students/${record.id}` });
    },
  },
});
</script>
