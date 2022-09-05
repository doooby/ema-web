<template>
  <b-form-group :label-for="domIdBase">
    <template #label>
      <t :value="labelTranslation" />
    </template>
    <div class="d-flex">
      <div class="flex-fill text-truncate form--control-label">
        {{ valueText }}
      </div>
      <b-button :id="domIdBase" @click="modalShown = true">
        <b-icon icon="chevron-down" />
      </b-button>
    </div>
    <b-modal v-model="modalShown" centered hide-footer>
      <template #modal-title>
        <t :value="labelTranslation" />
      </template>
      <b-list-group v-if="modalShown">
        <b-list-group-item
          v-for="option in options"
          :key="option.value"
          :active="values.includes(option.value)"
          button
          @click="onItemToggle(option)"
        >
          {{ $t(option.text) }}
        </b-list-group-item>
      </b-list-group>
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
export default class ListMultiple extends Vue {
  static fieldType: FormFieldType = {
    name: 'listMultiple',
  };

  @Prop({ required: true }) field!: FormField;
  @Prop({ required: true }) context!: FormGroupContext;
  @Prop({ required: true }) formValues!: FormValues;

  modalShown = false;

  get values () {
    return (this as any).rawValue ?? [];
  }

  get options (): Option[] {
    return this.field.options.options ?? [];
  }

  get valueText () {
    const selected = this.options
      .filter(options => this.values.includes(options.value));
    const listing = selected.map(option => this.$t(option.text)).join(', ');
    switch (selected.length) {
      case 0:
        return '';
      case 1:
        return listing;
      default:
        return `[${selected.length}] ${listing}`;
    }
  }

  onItemToggle (option: Option) {
    const newValues = [ ...this.values ];
    if (newValues.includes(option.value)) {
      const index = newValues.indexOf(option.value);
      if (index !== -1) newValues.splice(index, 1);
    } else {
      newValues.push(option.value);
    }
    (this as any).onChangeValue(Object.freeze(newValues));
  }
}
</script>
