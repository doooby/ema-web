<template>
  <div :class="className">
    <form-field
      v-for="field in fields"
      :key="field.name"
      :dom-id="domIdBase + field.name"
      :record="record"
      :field="field"
      :form-values="value"
      @change="change"
      @commit="commit"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import classNames from 'classnames';
import FormFieldComponent from './Field';
import { FormField, FormValues } from './types';

export default Vue.extend({
  components: { FormField: FormFieldComponent },
  props: {
    domIdBase: { type: String, default: '' },
    record: { type: Object as any, default: null },
    fields: { type: Array as PropType<Readonly<FormField[]>>, required: true },
    value: { type: Object as PropType<FormValues>, required: true },
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
    change ({ field, value }: { field: FormField, value: any }): void {
      this.$emit('input', Object.freeze({
        ...this.value,
        [field.name]: value,
      }));
    },
    commit () {
      this.$emit('commit');
    },
  },
});
</script>
