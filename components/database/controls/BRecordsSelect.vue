<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import Vue from 'vue';
import { BRecord } from '~/lib/api2';
import SearchBRecordsModal from '~/components/database/modals/SearchBRecordsModal.vue';
import BRecordLink from '~/components/database/components/BRecordLink.vue';

@Component({
  components: { SearchBRecordsModal, BRecordLink },
})
export default class BRecordsSelect extends Vue {
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ required: true }) readonly records!: BRecord[];
  @Prop({ default: false }) readonly singleRecord!: boolean;
  @Prop({ default: undefined }) readonly title!: string;
  @Prop({ default: undefined }) readonly domId!: string;
  @Prop({ default: undefined }) params!: any;
  @Prop({ default: false }) disabled!: boolean;

  modalShown = false;

  onRemoveRecord (record: BRecord) {
    const list = this.records.filter(({ id }) => id !== record.id);
    this.$emit('change', list);
  }

  onSelect (record: BRecord) {
    const selectedIds = this.records.map(record => record.id);
    if (selectedIds.includes(record.id)) {
      this.onRemoveRecord(record);
    } else if (this.singleRecord) {
      this.$emit('change', [ record ]);
      this.modalShown = false;
    } else {
      this.$emit('change', [ ...this.records, record ]);
    }
  }
}
</script>

<template>
  <div :id="domId" class="d-flex">
    <div class="controls--label flex-fill d-flex flex-wrap">
      <div
        v-for="record of records"
        :key="record.id"
        class="mr-3 d-flex align-items-center"
      >
        <b-record-link class="mr-2" :entity="entity" :record="record" :new-tab="true" />
        <btn-mini variant="secondary" icon="x" @click="onRemoveRecord(record)" />
      </div>
    </div>
    <b-button
      variant="secondary"
      size="sm"
      :disabled="disabled"
      @click="modalShown = true"
    >
      <b-icon :icon="singleRecord ? 'chevron-down' : 'plus'" />
    </b-button>
    <search-b-records-modal
      v-model="modalShown"
      :entity="entity"
      :params="params"
      :selected="records"
      @select="onSelect"
    />
  </div>
</template>
