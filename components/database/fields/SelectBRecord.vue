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
export default class SelectBRecord extends Vue {
  static fieldType: FormFieldType = {
    fillParams ({ name, options }, values, params) {
      // TODO t80
      params[options.paramsName || `${name}_id`] = values[name]?.id ?? '';
    },
  };

  @Prop({ required: true }) field!: FormField;
  @Prop({ required: true }) context!: FormGroupContext;
  @Prop({ required: true }) formValues!: FormValues;

  get entity (): string {
    return this.field.options?.entity || '';
  }

  get records () {
    const record = (this as any).rawValue;
    return record ? [ record ] : [];
  }
}
</script>

<template>
  <b-form-group :label-for="domIdBase">
    <template #label>
      <t :value="labelTranslation" />
    </template>
    <b-records-select
      :dom-id="domIdBase"
      :entity="entity"
      :single-record="true"
      :records="records"
      :title="labelTranslation"
      @change="onChangeValue($event[0])"
    />
  </b-form-group>
</template>
