<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <form-field name="name" :context="context" :values="values" />
      <form-field name="code" :context="context" :values="values" />
      <form-field name="contents" :context="context" :values="values" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import Vue from 'vue';

@Component
export default class RecordForm extends Vue {
  @Prop({ required: true }) readonly context!: any;
  @Prop({ required: true }) readonly values!: any;
}
</script>
