<!--<template>-->
<!--  <b-form-group-->
<!--    :label="label"-->
<!--    :label-for="domId"-->
<!--  >-->
<!--    <div class="input-group">-->
<!--      <input-->
<!--        :id="domId"-->
<!--        type="text"-->
<!--        class="form-control"-->
<!--        :value="sanitizedValue"-->
<!--        autocomplete="off"-->
<!--        @blur="onBlur"-->
<!--      >-->
<!--    </div>-->
<!--    <div class="input-group">-->
<!--      <div class="input-group-prepend">-->
<!--        <span class="input-group-text">-->
<!--          <t value="misc.language.en" />-->
<!--        </span>-->
<!--      </div>-->
<!--      <input-->
<!--        :id="domIdEn"-->
<!--        type="text"-->
<!--        class="form-control"-->
<!--        :value="sanitizedValueEn"-->
<!--        autocomplete="off"-->
<!--        @blur="onBlur"-->
<!--      >-->
<!--    </div>-->
<!--  </b-form-group>-->
<!--</template>-->

<!--<script lang="ts">-->
<!--import Vue from 'vue';-->
<!--import { FIELD_PROPS } from '..';-->

<!--export default Vue.extend({-->
<!--  props: FIELD_PROPS,-->
<!--  computed: {-->
<!--    domIdEn (): string {-->
<!--      return `${this.domId}_en`;-->
<!--    },-->
<!--    leftLabelText (): undefined | string {-->
<!--      const leftLabel = this.field.options.leftLabel;-->
<!--      if (!leftLabel) return undefined;-->
<!--      if (typeof leftLabel === 'function') return leftLabel();-->
<!--      return String(leftLabel);-->
<!--    },-->
<!--    rightLabelText (): undefined | string {-->
<!--      const rightLabel = this.field.options.rightLabel;-->
<!--      if (!rightLabel) return undefined;-->
<!--      if (typeof rightLabel === 'function') return rightLabel();-->
<!--      return String(rightLabel);-->
<!--    },-->
<!--    sanitizedValue (): string {-->
<!--      const rawValue = this.formValues[this.field.name];-->
<!--      return rawValue ? String(rawValue) : '';-->
<!--    },-->
<!--    sanitizedValueEn (): string {-->
<!--      const rawValue = this.formValues[`${this.field.name}_en`];-->
<!--      return rawValue ? String(rawValue) : '';-->
<!--    },-->
<!--  },-->
<!--  methods: {-->
<!--    onBlur (event: {target: HTMLInputElement}) {-->
<!--      this.$emit('change', event.target.value);-->
<!--    },-->
<!--  },-->
<!--});-->
<!--</script>-->
