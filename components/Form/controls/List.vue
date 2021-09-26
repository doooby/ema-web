<template>
  <b-form-group
    :label="labelTranslation"
    :label-for="domIdBase"
  >
    <div class="d-flex" @click="onChevronClick">
      <div class="flex-fill text-truncate association--text">
        {{ valueText }}
      </div>
      <b-button variant="secondary">
        <b-icon icon="chevron-down" />
      </b-button>
    </div>
    <b-modal
      v-model="modalShown"
      centered
      hide-footer
      :title="labelTranslation"
    >
      <div v-if="modalShown">
        <b-list-group>
          <b-list-group-item
            v-for="option in options"
            :key="option.value"
            :active="selected === option"
            button
            @click="onItemSelected(option)"
          >
            {{ option.caption }}
          </b-list-group-item>
        </b-list-group>
        <b-alert variant="secondary" :show="options === null || options.length === 0">
          empty
        </b-alert>
      </div>
    </b-modal>
  </b-form-group>
</template>

<script lang="ts">
import Vue from 'vue';
import { FIELD_PROPS2, FormField, FormValues } from '..';
import ControlMixin from '../ControlMixin';

type Option = { value: string, caption: string };

export const meta = {
  name: 'list',
  mapValues (field: FormField, record: any, values: FormValues = {}) {
    const name = field[0];
    values[name] = record[name] ?? undefined;
    return values;
  },
  mapRecord (field: FormField, values: FormValues, record: any = {}) {
    const name = field[0];
    const value = values[name];
    record[name] = value === undefined ? '' : value;
    return record;
  },
};

export default Vue.extend({
  mixins: [ ControlMixin ],
  props: FIELD_PROPS2,
  data () {
    return {
      modalShown: false,
    };
  },
  computed: {
    selected (): undefined | Option {
      if (!this.options) return undefined;
      const value = this.formValues[this.field[0]];
      const option = value && this.options.find(option => option.value === value);
      return option || undefined;
    },
    valueText (): string {
      return this.selected?.caption ?? '';
    },
    options (): Array<Option> {
      return (this.field[2] as any)?.options ?? [];
    },
  },
  methods: {
    onChevronClick () {
      this.modalShown = true;
    },
    onItemSelected (option: Option) {
      this.modalShown = false;
      this.context.onChange({ [this.field[0]]: option.value });
    },
  },
});
</script>
