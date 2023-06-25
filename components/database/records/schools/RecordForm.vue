<template>
  <div class="row">
    <div class="col-md-6">
      <form-field name="name" :context="context" :values="values" />
      <form-field name="education_levels" :context="context" :values="values" />
      <form-field name="director" :context="context" :values="values" />
      <form-field name="external_id" :context="context" :values="values" />
    </div>
    <div class="col-md-6">
<!--      <form-field name="address" :context="context" :values="values" />-->
    </div>
    <div class="col-12">
      <div class="border-bottom my-2" />
    </div>
    <div class="col-md-6">
      <form-field name="education_types" :context="context" :values="values" />
      <form-field name="gender_dedications" :context="context" :values="values" />
    </div>
    <div class="col-md-6">
      <form-field name="classrooms_count" :context="context" :values="values" />
      <form-field name="female_latrines_count" :context="context" :values="values" />
      <form-field name="male_latrines_count" :context="context" :values="values" />
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
