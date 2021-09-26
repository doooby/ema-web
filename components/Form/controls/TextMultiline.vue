<!--<template>-->
<!--  <b-form-group-->
<!--    :label="label"-->
<!--    :label-for="domId"-->
<!--  >-->
<!--    <div class="input-group">-->
<!--      <textarea-->
<!--        :id="domId"-->
<!--        class="form-control"-->
<!--        :value="sanitizedValue"-->
<!--        @blur="onBlur"-->
<!--      />-->
<!--    </div>-->
<!--  </b-form-group>-->
<!--</template>-->

<!--<script lang="ts">-->
<!--import Vue from 'vue';-->
<!--import { FIELD_PROPS } from '..';-->

<!--export default Vue.extend({-->
<!--  props: FIELD_PROPS,-->
<!--  computed: {-->
<!--    sanitizedValue (): string {-->
<!--      const rawValue = this.formValues[this.field[0]];-->
<!--      return rawValue ? String(rawValue) : '';-->
<!--    },-->
<!--  },-->
<!--  methods: {-->
<!--    onBlur (event: {target: HTMLTextAreaElement}) {-->
<!--      this.$emit('change', event.target.value);-->
<!--    },-->
<!--  },-->
<!--});-->
<!--</script>-->
