<template>
  <div :class="$attrs.class">
    <form-field
      v-for="field in fields"
      :key="field.name"
      :dom-id="domIdBase + field.name"
      :field="field"
      :form-values="value"
      @change="change"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import FormFieldComponent from './Field';
import { FormField, FormValues } from '.';

export default Vue.extend({
  components: {
    FormField: FormFieldComponent,
  },
  props: {
    domIdBase: {
      type: String,
      default: '',
    },
    fields: {
      type: Array as PropType<FormField[]>,
      required: true,
    },
    value: {
      type: Object as PropType<FormValues>,
      required: true,
    },
  },
  methods: {
    change ({ field, value }: { field: FormField, value: any }): void {
      this.$emit('input', Object.freeze({
        ...this.value,
        [field.name]: value,
      }));
    },
  },
});
</script>
