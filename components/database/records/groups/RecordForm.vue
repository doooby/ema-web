<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <form-field name="course" :context="context" :values="values" />
      <form-field name="name" :context="context" :values="values" />
      <form-field name="term" :context="context" :values="values" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class RecordForm extends Vue {
  @Prop({ required: true }) readonly context!: any;
  @Prop({ required: true }) readonly values!: any;
}
</script>
