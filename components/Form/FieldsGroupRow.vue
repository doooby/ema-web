<template>
  <div :class="classNames">
    <div
      v-for="field in fields"
      :key="field[0]"
      class="ew-16"
    >
      <form-field
        :dom-id="buildFieldDomId(field)"
        :record="record"
        :field="field"
        :form-values="value"
        @change="onChange"
        @commit="onCommit"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import classNames from 'classnames';
import { FIELD_PROPS, FormField } from '.';
import FormFieldComponent from './Field';

export default Vue.extend({
  components: { FormField: FormFieldComponent },
  props: FIELD_PROPS,
  data () {
    const value = Number(this.formValues[this.field[0]]);
    return {
      value: isNaN(value) ? '' : value,
    };
  },
  computed: {
    fields (): FormField[] {
      return (this.field[2] as any)?.fields || [];
    },
    classNames () {
      return classNames(
        'd-flex fields-group-row',
        (this.field[2] as any)?.small && '-small',
      );
    },
  },
  methods: {
    buildFieldDomId (field: FormField) {
      const name = field[0];
      return `${this.domId}_${name}`;
    },
    onChange (value: any): void {
      this.$emit('change', value);
    },
    onCommit (): void {
      this.$emit('commit');
    },
  },
});
</script>
