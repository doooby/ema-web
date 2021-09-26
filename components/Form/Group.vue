<template>
  <div :class="className">
    <slot
      v-if="$scopedSlots.layout"
      name="layout"
      :context="groupContext"
      :values="value"
    />
    <form-field
      v-for="field in fields"
      v-else
      :key="field[0]"
      :name="field[0]"
      :context="groupContext"
      :values="value"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import classNames from 'classnames';
import { changedFormValues, FormField, FormGroupContext, FormValues } from '.';
import FormFieldComponent from './Field';

export default Vue.extend({
  components: { FormField: FormFieldComponent },
  props: {
    value: { type: Object as PropType<FormValues>, required: true },
    fields: { type: Array as PropType<FormField[]>, required: true },
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
    fieldsIndex (): { [field: string]: undefined | FormField } {
      const index = {} as any;
      for (const field of this.fields) index[field[0]] = field;
      return index;
    },
    groupContext (): FormGroupContext {
      return {
        namePrefix: (name: string) => `${this.namePrefix}_${name}`,
        fieldLabelKey: (name: string) => `${this.labelPrefix}.${name}`,
        field: (name: string): undefined | FormField => {
          const field = this.fieldsIndex[name];
          if (!field) utils.warn(`Form.Group cann't find field ${name}`);
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
