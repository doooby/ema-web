<template>
  <div>
    <form-field name="person" :context="context" :values="values" />
    <form-field name="position" :context="context" :values="values" />
    <form-field name="starts_on" :context="context" :values="values" />
    <form-field name="ends_on" :context="context" :values="values" />
    <form-field name="resigned_on" :context="context" :values="values" />
    <form-field name="comment" :context="context" :values="values" />
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
