<template>
  <div :class="className">
    <form-field
      v-for="field in fields"
      :key="fieldName(field)"
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
import { FormField, FormField2, FormValues } from './types';

export default Vue.extend({
  components: { FormField: FormFieldComponent },
  props: {
    domId: { type: String, default: '' },
    record: { type: Object as any, default: null },
    fields: { type: Array as PropType<Readonly<FormField[] | FormField2[]>>, required: true },
    value: { type: Object as PropType<FormValues>, default: {} },
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
    fieldName (field: FormField | FormField2) {
      return Array.isArray(field) ? field[0] : field.name;
    },
    buildFieldDomId (field: FormField | FormField2) {
      const name = this.fieldName(field);
      return this.domId ? `${this.domId}_${name}` : name;
    },
    onChange ({ field, value }: { field: FormField | FormField2, value: any }): void {
      const name = this.fieldName(field);
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
