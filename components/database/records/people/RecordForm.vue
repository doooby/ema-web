<template>
  <div class="row">
    <div class="col-md-6">
      <form-field name="first_name" :context="context" :values="values" />
      <form-field name="last_name" :context="context" :values="values" />
      <form-field name="gender" :context="context" :values="values" />
      <form-field name="born_on" :context="context" :values="values" />
    </div>
    <div class="col-md-6">
      <form-field name="mother_first_name" :context="context" :values="values" />
      <form-field name="mother_last_name" :context="context" :values="values" />
      <form-field name="father_first_name" :context="context" :values="values" />
      <form-field name="father_last_name" :context="context" :values="values" />
    </div>
    <div class="col-md-6">
      <form-field name="nationality" :context="context" :values="values" />
      <form-field name="mother_tongue" :context="context" :values="values" />
    </div>
    <div class="col-md-6">
      <form-field name="student_kobo_no" :context="context" :values="values" />
      <form-field name="citizen_id" :context="context" :values="values" />
      <form-field name="passport_no" :context="context" :values="values" />
      <form-field name="telephone_no" :context="context" :values="values" />
    </div>
    <div class="col-12">
      <div class="border-bottom my-2" />
    </div>
    <div class="col-md-6">
      <form-field name="spoken_languages" :context="context" :values="values" />
      <form-field name="residency_status" :context="context" :values="values" />
      <form-field name="school_distance_km" :context="context" :values="values" />
      <form-field name="school_distance_min" :context="context" :values="values" />
      <form-field name="school_transport" :context="context" :values="values" />
    </div>
    <div class="col-md-6">
      <form-field name="registered_on" :context="context" :values="values" />
      <form-field name="enrollment_reasons" :context="context" :values="values" />
      <form-field name="outside_school" :context="context" :values="values" />
    </div>
    <div class="col-12">
      <div class="border-bottom my-2" />
    </div>
    <div class="col-md-6">
      <form-field name="disability_diagnosis" :context="context" :values="values" />
      <form-field name="assistance_needed" :context="context" :values="values" />
      <form-field name="assistance_provided" :context="context" :values="values" />
      <form-field name="disability_note" :context="context" :values="values" />
      <form-field name="disabilities" :context="context" :values="values" />
    </div>
    <div class="col-12">
      <div class="border-bottom my-2" />
    </div>
    <div class="col-12">
      <form-field name="caregivers" :context="context" :values="values" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class extends Vue {
  @Prop({ required: true }) readonly context!: any;
  @Prop({ required: true }) readonly values!: any;
}
</script>
