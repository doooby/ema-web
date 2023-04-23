<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <form-field name="name" :context="context" :values="values" />
      <form-field name="education_levels" :context="context" :values="values" />
      <form-field name="terms" :context="context" :values="values" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import { FormGroupContext } from '~/components/Form';
import Vue from 'vue';

@Component
export default class RecordForm extends Vue {
  @Prop({ required: true }) readonly context!: FormGroupContext;
  @Prop({ required: true }) readonly values!: any;
}
</script>
