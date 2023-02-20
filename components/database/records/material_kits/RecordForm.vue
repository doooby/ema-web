<template>
  <div>
    <form-field name="name" :context="context" :values="values" />
    <form-field name="code" :context="context" :values="values" />
    <form-field name="contents" :context="context" :values="values" />
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import { DatabasePage } from '~/components';

@Component
export default class extends DatabasePage {
  @Prop({ required: true }) readonly context!: any;
  @Prop({ required: true }) readonly values!: any;
}
</script>
