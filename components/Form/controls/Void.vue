<template>
  <b-alert show variant="danger">
    Form.field.unknown_control
  </b-alert>
</template>

<script lang="ts">
import Vue from 'vue';
import { FIELD_PROPS, FormFieldType, FormField, FormValues } from '..';
import ControlMixin from '../ControlMixin';

export const type: Omit<FormFieldType, 'control'> = {
  name: 'void',
  mapToValues (_field: FormField, _record: any, values: FormValues = {}) {
    return values;
  },
  mapToRecord (_field: FormField, _values: FormValues, record: any = {}) {
    return record;
  },
};

export default Vue.extend({
  mixins: [ ControlMixin ],
  props: FIELD_PROPS,
});
</script>
