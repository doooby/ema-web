<template>
  <b-alert show variant="danger">
    Form.field.unknown_control
  </b-alert>
</template>

<script lang="ts">
import Vue from 'vue';
import { FormFieldType, FormField, FormValues, FormGroupContext } from '..';
import ControlMixin from '../ControlMixin';

export const type: FormFieldType = {
  name: 'void',
  mapToValues (_field: FormField, _record: any, values: FormValues = {}) {
    return values;
  },
  mapToRecordParams (_field: FormField, _values: FormValues, record: any = {}) {
    return record;
  },
};

export default Vue.extend({
  mixins: [ ControlMixin ],
  props: {
    field: { type: Object as Vue.PropType<FormField>, required: true },
    context: { type: Object as Vue.PropType<FormGroupContext>, required: true },
    formValues: { type: Object as Vue.PropType<FormValues>, required: true },
  },
});
</script>
