<template>
  <b-form-group
    :label-for="domIdBase"
  >
    <template #label>
      <t :value="labelTranslation" />
    </template>

    <div class="input-group">
      <div class="input-group-prepend">
        <span class="input-group-text">
          <t value="form.field.name.en" />
        </span>
      </div>
      <input
        :id="domIdBase"
        type="text"
        class="form-control"
        :value="sanitizedValue[0]"
        autocomplete="off"
        @input="onInputEn"
      >
    </div>

    <div class="input-group">
      <div class="input-group-prepend">
        <span class="input-group-text">
          <t value="form.field.name.local" />
        </span>
      </div>
      <input
        :id="`${domIdBase}_local`"
        type="text"
        class="form-control"
        :value="sanitizedValue[1]"
        autocomplete="off"
        @input="onInputLoc"
      >
    </div>
  </b-form-group>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { FormField, FormFieldType, FormGroupContext, FormValues } from '~/components/Form';
import ControlMixin from '~/components/Form/ControlMixin';

@Component({
  mixins: [ ControlMixin ],
})
export default class Name extends Vue {
  static fieldType: FormFieldType = {
    name: 'name',
    fillValues ({ name }, record, values) {
      values[name] = record[name];
      return values;
    },
    fillParams ({ name }, values, record) {
      record[name] = values[name] ?? [ '', '' ];
      return record;
    },
  };

  @Prop({ required: true }) field!: FormField;
  @Prop({ required: true }) context!: FormGroupContext;
  @Prop({ required: true }) formValues!: FormValues;

  get sanitizedValue (): [string, string] {
    let value = this.formValues[this.field.name];
    if (!Array.isArray(value)) value = [];
    if (!value[0] || typeof value[0] !== 'string') value[0] = '';
    if (!value[1] || typeof value[1] !== 'string') value[1] = '';
    return [ value[0], value[1] ];
  }

  onInputEn (event) {
    const newValue = [ event.target.value, this.sanitizedValue[1] ];
    (this as any).debouncedOnChange({ [this.field.name]: newValue });
  }

  onInputLoc (event) {
    const newValue = [ this.sanitizedValue[0], event.target.value ];
    (this as any).debouncedOnChange({ [this.field.name]: newValue });
  }
}
</script>
