<template>
  <b-form-group
    :label="labelTranslation"
  >
    <div class="d-flex" @click="onChevronClick">
      <div class="flex-fill text-truncate association--text">
        {{ valueText }}
      </div>
      <b-button variant="secondary" @click.stop="onClear">
        <b-icon icon="x" />
      </b-button>
      <b-button variant="secondary">
        <b-icon icon="chevron-down" />
      </b-button>
    </div>
    <b-modal
      v-model="modalShown"
      hide-footer
      :title="labelTranslation"
    >
      <search-modal
        v-if="modalShown"
        :fetch-query="fetchQuery"
        :selected-id="selectedRecord && selectedRecord.id"
        @select="onItemSelected"
      />
    </b-modal>
  </b-form-group>
</template>

<script lang="ts">
import Vue from 'vue';
import { FormFieldType, FormField, FormValues, FormGroupContext } from '~/components/Form';
import ControlMixin from '~/components/Form/ControlMixin';

import SearchModal from './SearchModal.vue';

export const type: FormFieldType = {
  mapToValues ({ name }: FormField, record: any, values: FormValues = {}) {
    values[name] = record[name] ?? undefined;
    return values;
  },
  mapToRecordParams ({ name, options }: FormField, values: FormValues, record: any = {}) {
    record[options.paramsName || `${name}_id`] = values[name]?.id;
    return record;
  },
};

export default Vue.extend({
  components: { SearchModal },
  mixins: [ ControlMixin ],
  props: {
    field: { type: Object as Vue.PropType<FormField>, required: true },
    context: { type: Object as Vue.PropType<FormGroupContext>, required: true },
    formValues: { type: Object as Vue.PropType<FormValues>, required: true },
  },
  data () {
    return {
      modalShown: false,
    };
  },
  computed: {
    selectedRecord (): undefined | any {
      return this.formValues[this.field.name] ?? undefined;
    },
    valueText (): string {
      const value = this.selectedRecord;
      return value ? value.caption : '';
    },
    fetchQuery (): any {
      const entity = this.field.options.entity;
      const query = entity && (this.$api.queries as any)[entity]?.searchAssociated;
      if (query) return query;

      utils.raise(new Error(`Form.controls.Association: query not found for entity ${entity}`));
      return null;
    },
  },
  methods: {
    onChevronClick () {
      this.modalShown = true;
    },
    onItemSelected (record: any) {
      this.modalShown = false;
      this.context.onChange({ [this.field.name]: record });
    },
    onClear () {
      this.context.onChange({ [this.field.name]: undefined });
    },
  },
});
</script>
