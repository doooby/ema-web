<template>
  <b-form-group
    :label-for="domIdBase"
  >
    <template #label>
      <t :value="labelTranslation" />
    </template>
    <select-or-fill-input
      :dom-id="domIdBase"
      :options="options"
      :value="sanitizedValue"
      @input="onChangeValue($event)"
    />
  </b-form-group>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import ControlMixin from '~/components/Form/ControlMixin';
import { FormField, FormFieldType, FormGroupContext, FormValues } from '~/components/Form';
import SelectOrFillInput from '~/components/Form/primitives/SelectOrFillInput.vue';
import app from '~/lib/app';

@Component({
  mixins: [ ControlMixin ],
  components: { SelectOrFillInput },
})
export default class SelectOrFill extends Vue {
  static fieldType: FormFieldType = {
    name: 'selectOrFill',
    fillParams ({ name }, values, record) {
      record[name] = values[name] ?? [ '' ];
      return record;
    },
  };

  @Prop({ required: true }) field!: FormField;
  @Prop({ required: true }) context!: FormGroupContext;
  @Prop({ required: true }) formValues!: FormValues;

  get sanitizedValue (): [string, undefined | string] {
    const value = this.formValues[this.field.name];
    if (Array.isArray(value)) {
      return [
        value[0],
        value[1],
      ];
    } else {
      return [ '', undefined ];
    }
  }

  get options (): app.Option[] {
    return this.field.options.options ?? [];
  }
}
</script>
