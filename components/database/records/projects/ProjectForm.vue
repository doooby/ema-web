<template>
  <div class="row">
    <div class="col-md-6">
      <form-field name="name" :context="context" :values="values" />
      <form-field name="full_name" :context="context" :values="values" />
      <form-field name="code" :context="context" :values="values" />
      <form-field name="short_name_en" :context="context" :values="values" />
    </div>
    <div class="col-md-6">
      <form-field name="schools" :context="context" :values="values" />
      <form-field name="donors" :context="context" :values="values" />
      <form-field name="starts_on" :context="context" :values="values" />
      <form-field name="ends_on" :context="context" :values="values" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import Vue from 'vue';

@Component
export default class ProjectForm extends Vue {
  @Prop({ required: true }) readonly context!: any;
  @Prop({ required: true }) readonly values!: any;
}
</script>
