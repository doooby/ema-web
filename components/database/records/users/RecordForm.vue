<template>
  <div>

    <div class="row">
      <div class="col-lg">
        <form-field name="login" :context="context" :values="values" />
      </div>
      <div class="col-lg">
        <form-field name="full_name" :context="context" :values="values" />
      </div>
      <div class="col-lg">
        <form-field name="is_root" :context="context" :values="values" />
      </div>
    </div>

    <div class="row">
      <div class="col-lg">
        <form-field name="privileges" :context="context" :values="values" />
      </div>
      <div class="col-lg" />
      <div class="col-lg" />
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { controls } from '~/components/Form';

@Component
export default class RecordForm extends DatabasePage {
  @Prop({ required: true }) readonly context!: any;
  @Prop({ required: true }) readonly values!: any;

  controls = controls;
}
</script>
