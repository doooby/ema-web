<template>
  <b-form-group>
    <template #label>
      <t :value="labelTranslation" />
    </template>
    <abbreviated-record-select
      :entity="entity"
      :record="rawValue"
      @select="onChangeValue($event)"
    >
      <template #modal-title>
        <t :value="labelTranslation" />
      </template>
    </abbreviated-record-select>
  </b-form-group>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import ControlMixin from '~/components/Form/ControlMixin';
import { FormField, FormFieldType, FormGroupContext, FormValues } from '~/components/Form';
import AbbreviatedRecordSelect
  from '~/components/database/controls/AbbreviatedRecordSelect.vue';

@Component({
  components: { AbbreviatedRecordSelect },
  mixins: [ ControlMixin ],
})
export default class AbbreviatedRecordField extends Vue {
  static fieldType: FormFieldType = {
    fillParams ({ name, options }, values, params) {
      params[options.paramsName || `${name}_id`] = values[name]?.id ?? '';
    },
  };

  @Prop({ required: true }) field!: FormField;
  @Prop({ required: true }) context!: FormGroupContext;
  @Prop({ required: true }) formValues!: FormValues;

  get entity (): string {
    return this.field.options?.entity || '';
  }
}
</script>
