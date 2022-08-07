<template>
  <b-form-group
    :label-for="domIdBase"
  >
    <template #label>
      <t :value="labelTranslation" />
    </template>
    <b-form-select
      :id="domIdBase"
      :value="selected && selected.value"
      :options="options"
      @change="onSelect"
    />
    <input
      v-if="sanitizedValue[0] === otherOption"
      :id="`${domIdBase}_fill`"
      type="text"
      class="form-control"
      :value="sanitizedValue[1]"
      autocomplete="off"
      @blur="onFill"
    >
  </b-form-group>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import ControlMixin from '~/components/Form/ControlMixin';
import { FormField, FormFieldType, FormGroupContext, FormValues } from '~/components/Form';
import { Option } from '~/lib/types';

const OTHER_OPTION = '_other';

@Component({
  mixins: [ ControlMixin ],
})
export default class SelectOrFill extends Vue {
  static fieldType: FormFieldType = {
    name: 'selectOrFill',
    fillParams ({ name }, values, record) {
      record[name] = values[name] ?? [ '' ];
      return record;
    },
  };

  otherOption = OTHER_OPTION;

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

  get selected (): undefined | Option {
    const value = this.sanitizedValue[0];
    return this.options.find(option => option.value === value);
  }

  get options (): Array<Option> {
    const list = (this.field.options.options ?? []).map(option => ({
      value: option.value,
      text: option.translated ? option.text : this.$t(option.text),
    }));
    list.push({ value: OTHER_OPTION, text: this.$t('app.common.label.other') });
    return list;
  }

  onSelect (value: any): void {
    const option = value ? this.options.find(option => option.value === value) : undefined;
    this.context.onChange({ [this.field.name]: [ option?.value, undefined ] });
  }

  onFill (event: {target: HTMLInputElement}): void {
    const newValue = [ this.sanitizedValue[0], event.target.value ];
    this.context.onChange({ [this.field.name]: newValue });
  }
}
</script>
