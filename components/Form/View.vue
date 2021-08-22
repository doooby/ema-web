<template>
  <div :class="className">
    <form-field
      v-for="field in fields"
      :key="field[0]"
      :dom-id="buildFieldDomId(field)"
      :record="record"
      :field="field"
      :form-values="value"
      @change="onChange"
      @commit="onCommit"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import classNames from 'classnames';
import FormFieldComponent from './Field';
import { FormField2, FormValues } from './types';

export default Vue.extend({
  components: { FormField: FormFieldComponent },
  props: {
    domId: { type: String, default: '' },
    record: { type: Object as any, default: null },
    fields: { type: Array as PropType<Readonly<FormField2[]>>, required: true },
    value: { type: Object as PropType<FormValues>, default: () => ({}) },
  },
  computed: {
    className (): string {
      return classNames(
        'form',
        this.$attrs.class,
      );
    },
  },
  methods: {
    buildFieldDomId (field: FormField2) {
      const name = field[0];
      return this.domId ? `${this.domId}_${name}` : name;
    },
    onChange ({ field, value }: { field: FormField2, value: any }): void {
      const name = field[0];
      this.$emit('input', Object.freeze({
        ...this.value,
        [name]: value,
      }));
    },
    onCommit () {
      this.$emit('commit');
    },
  },
});
</script>
