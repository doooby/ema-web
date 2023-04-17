<template>
  <div>
    <form-field name="name" :context="context" :values="values" />
    <form-field name="education_levels" :context="context" :values="values" />
    <form-field name="categories" :context="context" :values="values" />
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
