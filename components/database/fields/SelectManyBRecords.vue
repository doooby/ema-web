<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import Vue from 'vue';
import BRecordsSelect from '~/components/database/controls/BRecordsSelect.vue';
import ControlMixin from '~/components/Form/ControlMixin';
import { FormField, FormFieldType, FormGroupContext, FormValues } from '~/components/Form';

@Component({
  mixins: [ ControlMixin ],
  components: { BRecordsSelect },
})
export default class SelectMultipleBRecords extends Vue {
  static fieldType: FormFieldType = {
    fillParams ({ name, options }, values, params) {
      params[options.paramsName || `${name}_ids`] = values[name]?.map(r => r.id);
    },
  };

  @Prop({ required: true }) field!: FormField;
  @Prop({ required: true }) context!: FormGroupContext;
  @Prop({ required: true }) formValues!: FormValues;

  get entity (): string {
    return this.field.options?.entity || '';
  }

  get records () {
    return (this as any).rawValue ?? [];
  }
}
</script>

<template>
  <b-form-group>
    <template #label>
      <t :value="labelTranslation" />
    </template>
    <b-records-select
      :entity="entity"
      :records="records"
      :title="labelTranslation"
      @change="onChangeValue($event)"
    />
  </b-form-group>
</template>
