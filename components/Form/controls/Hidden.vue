<template>
  <div />
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { FormField, FormFieldType, FormValues } from '~/components/Form';

@Component
export default class Hidden extends Vue {
  static fieldType: FormFieldType = {
    name: 'hidden',
    mapToValues ({ name, options }: FormField, _record: any, values: FormValues = {}) {
      values[name] = options.value;
      return values;
    },
    mapToRecordParams ({ name }: FormField, values: FormValues, record: any = {}) {
      record[name] = String(values[name]) || '';
      return record;
    },
  };
}
</script>
