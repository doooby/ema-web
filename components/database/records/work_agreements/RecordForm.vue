<template>
  <div>
    <form-field name="school" :context="context" :values="values" />
    <form-field name="person" :context="context" :values="values" />
    <form-field name="projects" :context="context" :values="values" />
    <form-field name="donors" :context="context" :values="values" />
    <form-field name="position" :context="context" :values="values" />
    <form-field name="starts_on" :context="context" :values="values" />
    <form-field name="ends_on" :context="context" :values="values" />
    <form-field name="resigned_on" :context="context" :values="values" />
    <form-field name="comment" :context="context" :values="values" />
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import { FormGroupContext } from '~/components/Form';
import Vue from 'vue';

@Component
export default class extends Vue {
  @Prop({ required: true }) readonly context!: FormGroupContext;
  @Prop({ required: true }) readonly values!: any;
}
</script>
