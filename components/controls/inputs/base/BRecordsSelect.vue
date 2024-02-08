<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import SearchBRecordsModal from '~/components/database/modals/SearchBRecordsModal.vue';
import BRecordLink from '~/components/database/components/BRecordLink.vue';
import { Params } from '~/lib/api2';
import controls from '~/components/controls';
import { wai } from '~/vendor/wai';
import RecordId from '~/components/views/application/RecordId.vue';

@Component({
  components: { RecordId, SearchBRecordsModal, BRecordLink },
})
export default class BRecordsSelect extends Vue {
  @Prop() readonly domId?: string;
  @Prop() readonly disabled?: boolean;
  @Prop({ default: () => [] }) readonly value!: wai.AResource[];
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ default: false }) readonly multiple!: boolean;
  @Prop() params?: Params;

  modalShown = false;

  onShow () {
    if (this.disabled) return;
    this.modalShown = true;
  }

  onRemoveRecord (record: wai.AResource) {
    if (this.disabled) return;
    const list = this.value.filter(({ id }) => id !== record.id);
    this.emitChange(list);
  }

  onSelect (record: wai.AResource) {
    const selectedIds = this.value.map(record => record.id);
    if (selectedIds.includes(record.id)) {
      this.onRemoveRecord(record);
    } else if (this.multiple) {
      this.emitChange([ ...this.value, record ]);
    } else {
      this.emitChange([ record ]);
      this.modalShown = false;
    }
  }

  // TODO cleanup
  get unsafeValue () {
    return this.value as any;
  }

  static asField = {

    option: (
      name: string,
      param: string = name,
    ): Pick<controls.FieldDefinition, 'name' | 'populateParams' > => ({
      name,
      populateParams (values: any, params) {
        params[param] = values[name]?.map(({ value }) => value)?.[0];
      },
    }),

    records: (
      name: string,
      param: string = `${name}_ids`,
    ): Pick<controls.FieldDefinition, 'name' | 'populateParams' > => ({
      name,
      populateParams (values: any, params) {
        params[param] = values[name]?.map(({ id }) => id);
      },
    }),

  };

  emitChange (list) {
    this.$emit('input', list);
    this.$emit('change', list);
  }
}
</script>

<template>
  <div
    :id="domId"
    tabindex="0"
    class="d-flex"
    @keypress.space.stop="onShow"
  >
    <div class="controls--label flex-fill d-flex flex-wrap">
      <div
        v-for="record of value"
        :key="record.id"
        class="mr-3 d-flex align-items-center"
      >
        <RecordId
          class="d-inline-block mr-2 font-14"
          :record="record"
          :path="`/database/${entity}/${record.id}`"
          :new-tab="true"
        />
        <btn-mini variant="secondary" icon="x" @click="onRemoveRecord(record)" />
      </div>
    </div>
    <b-button
      variant="secondary"
      size="sm"
      :disabled="disabled"
      @click="onShow"
    >
      <b-icon :icon="multiple ? 'plus' : 'chevron-down'" />
    </b-button>
    <search-b-records-modal
      v-model="modalShown"
      :entity="entity"
      :params="params"
      :selected="unsafeValue"
      @select="onSelect"
    />
  </div>
</template>
