<template>
  <div :class="className">
    <slot
      v-if="$scopedSlots.layout"
      name="layout"
      :context="groupContext"
      :values="value"
    />
    <form-field
      v-for="{ name } in buildFields"
      v-else
      :key="name"
      :name="name"
      :context="groupContext"
      :values="value"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import classNames from 'classnames';
import { buildFormFields, changedFormValues, FormField, FormFieldDefinition, FormGroupContext, FormValues } from '.';
import FormFieldComponent from './Field';

export default Vue.extend({
  components: { FormField: FormFieldComponent },
  props: {
    value: { type: Object as Vue.PropType<FormValues>, default: () => Object.freeze({}) },
    fields: { type: Array as Vue.PropType<FormField[]>, default: undefined },
    fieldsDefinitions: { type: Array as Vue.PropType<FormFieldDefinition[]>, default: undefined },
    namePrefix: { type: String, default: '' },
    labelPrefix: { type: String, default: 'form.fields' },
  },
  computed: {
    className (): string {
      return classNames(
        'form--group',
        this.$attrs.class,
      );
    },
    buildFields (): FormField[] {
      if (this.fields) return this.fields;
      if (this.fieldsDefinitions) return buildFormFields(this.fieldsDefinitions);
      return [];
    },
    fieldsIndex (): { [field: string]: undefined | FormField } {
      const index = {} as any;
      for (const field of this.buildFields) index[field.name] = field;
      return index;
    },
    groupContext (): FormGroupContext {
      return {
        namePrefix: (name: string) => `${this.namePrefix}_${name}`,
        fieldLabelKey: (name: string) => `${this.labelPrefix}.${name}`,
        field: (name: string): undefined | FormField => {
          const field = this.fieldsIndex[name];
          if (!field) utils.warn(`Form.Group can't find field ${name}`);
          return field;
        },
        onChange: (changes: FormValues) => {
          this.$emit('input', changedFormValues({ ...this.value, ...changes }));
        },
      };
    },
  },
});
</script>
