<template>
  <b-form-group>
    <template #label>
      <t :value="labelTranslation" />
    </template>
    <div v-if="records.length" class="form--control-label">
      <div
        v-for="record of records"
        :key="record.id"
        class="d-flex align-items-center"
      >
        <span class="emr-2">
          {{ record.labels.caption }}
        </span>
        <btn-mini variant="secondary" icon="x" @click="onRemoveRecord(record)" />
      </div>
    </div>
    <div>
      <btn-mini variant="primary" icon="plus" @click="modalShown = true" />
    </div>
    <b-modal
      v-model="modalShown"
      hide-footer
    >
      <template #modal-title>
        <t :value="labelTranslation" />
      </template>
      <search-modal
        v-if="modalShown"
        :selected-records="records"
        :build-query="onBuildSearchQuery"
        @select="onSelectRecord"
      />
    </b-modal>
  </b-form-group>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import ControlMixin from '~/components/Form/ControlMixin';
import { FormField, FormFieldType, FormGroupContext, FormValues } from '~/components/Form';
import SearchModal from '~/components/database/SearchModal.vue';
import * as mappers from '~/lib/api/mappers';

@Component({
  mixins: [ ControlMixin ],
  components: { SearchModal },
})
export default class AbbreviatedRecordsField extends Vue {
  static fieldType: FormFieldType = {
    fillParams ({ name, options }, values, params) {
      params[options.paramsName || `${name}_ids`] = values[name]?.map(r => r.id);
    },
  };

  @Prop({ required: true }) field!: FormField;
  @Prop({ required: true }) context!: FormGroupContext;
  @Prop({ required: true }) formValues!: FormValues;

  modalShown = false;

  get entity (): string {
    return this.field.options?.entity || '';
  }

  get records (): mappers.AbbreviatedRecord[] {
    return (this as any).rawValue ?? [];
  }

  onBuildSearchQuery () {
    return {
      path: `/${this.entity}`,
      mapper: mappers.paginatedAbbreviatedRecords,
    };
  }

  onSelectRecord (record: mappers.AbbreviatedRecord) {
    this.modalShown = false;
    if (this.records.find(({ id }) => id === record.id)) return;
    (this as any).onChangeValue([ ...this.records, record ]);
  }

  onRemoveRecord (record: mappers.AbbreviatedRecord) {
    (this as any).onChangeValue(this.records.filter(({ id }) => id !== record.id));
  }
}
</script>
