<template>
  <div>
    <form-field name="name" :context="context" :values="values" />
    <form-field name="education_levels" :context="context" :values="values" />
    <form-field name="terms" :context="context" :values="values" />
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { FormGroupContext } from '~/components/Form';

@Component
export default class extends DatabasePage {
  @Prop({ required: true }) readonly context!: FormGroupContext;
  @Prop({ required: true }) readonly values!: any;
}
</script>
