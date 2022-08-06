<template>
  <b-form-group :label-for="domIdBase">
    <template #label>
      <t :value="labelTranslation" />
    </template>
    <div class="d-flex">
      <div class="flex-fill text-truncate association--text">
        {{ valueText }}
      </div>
      <b-button :id="domIdBase" @click="onChevronClick">
        <b-icon icon="chevron-down" />
      </b-button>
    </div>
    <b-modal v-model="modalShown" centered hide-footer>
      <template #modal-title>
        <t :value="labelTranslation" />
      </template>
      <b-list-group v-if="modalShown">
        <b-list-group-item
          v-if="blankOption"
          key="--blank--"
          button
          @click="onItemSelected(blankOption)"
        >
          <t value="db.record.shared.label.any" />
        </b-list-group-item>
        <b-list-group-item
          v-for="option in options"
          :key="option.value"
          :active="selected === option"
          button
          @click="onItemSelected(option)"
        >
          {{ option.text }}
        </b-list-group-item>
      </b-list-group>
      <b-alert
        v-if="options === null || options.length === 0"
        show
        variant="secondary"
      >
        empty
      </b-alert>
    </b-modal>
  </b-form-group>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import ControlMixin from '~/components/Form/ControlMixin';
import { FormField, FormFieldType, FormGroupContext, FormValues } from '~/components/Form';
import { Option } from '~/lib/types';

@Component({
  mixins: [ ControlMixin ],
})
export default class List extends Vue {
  static fieldType: FormFieldType = {
    name: 'list',
    fillParams ({ name }, values, record) {
      const value = values[name];
      record[name] = value === undefined ? '' : value;
      return record;
    },
  };

  @Prop({ required: true }) field!: FormField;
  @Prop({ required: true }) context!: FormGroupContext;
  @Prop({ required: true }) formValues!: FormValues;

  modalShown = false;

  get selected (): undefined | Option {
    if (!this.options) return undefined;
    const value = this.formValues[this.field.name];
    const option = value && this.options.find(option => option.value === value);
    return option || undefined;
  }

  get valueText (): string {
    return this.selected?.text ?? '';
  }

  get blankOption (): undefined | Option {
    if (!this.field.options.blank) return;
    return { value: '', text: '' };
  }

  get options (): Array<Option> {
    return this.field.options.options ?? [];
  }

  onChevronClick () {
    this.modalShown = true;
  }

  onItemSelected (option: Option) {
    this.modalShown = false;
    this.context.onChange({ [this.field.name]: option.value });
  }
}
</script>
