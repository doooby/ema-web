<template>
  <div class="row">
    <div class="col-md-6">
      <form-field name="school" :context="context" :values="values" />
      <form-field name="project" :context="context" :values="values" />
    </div>
    <div class="col-md-6">
      <form-field name="school_year" :context="context" :values="values" />
      <form-field name="time_ranges" :context="context" :values="values" />
    </div>
    <div class="col-12">
      <div class="border-bottom my-2" />
    </div>
    <div class="col-md-6">
      <form-field name="standardized_course" :context="context" :values="values" />
    </div>
    <div class="col-md-6">
      <form-field name="name" :context="context" :values="values" />
      <form-field name="education_level" :context="context" :values="values" />
    </div>
    <div class="col-12">
      <div class="border-bottom my-2" />
    </div>
    <div class="col-md-6">
      <form-field name="is_formal" :context="context" :values="values" />
      <form-field name="grade" :context="context" :values="values" />
      <form-field name="accreditation_authority" :context="context" :values="values" />
    </div>
    <div class="col-md-6">
      <form-field name="lesson_duration" :context="context" :values="values" />
      <form-field name="attendance_limit" :context="context" :values="values" />
      <form-field name="preferred_grading" :context="context" :values="values" />
    </div>
    <div class="col-12">
      <div class="border-bottom my-2" />
    </div>
    <div class="col-12">
      <form-field name="subjects" :context="context" :values="values" />
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
