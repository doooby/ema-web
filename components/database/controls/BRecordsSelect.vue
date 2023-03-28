<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import Vue from 'vue';
import { BRecord } from '~/lib/api2';
import SearchBRecordsModal from '~/components/database/modals/SearchBRecordsModal.vue';

@Component({
  components: { SearchBRecordsModal },
})
export default class BRecordsSelect extends Vue {
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ required: true }) readonly records!: BRecord[];
  @Prop({ default: false }) readonly multi!: boolean;
  @Prop({ default: undefined }) readonly title!: string;

  modalShown = false;

  onRemoveRecord (record: BRecord) {
    const list = this.records.slice();
    const index = list.indexOf(record);
    if (index !== -1) {
      list.splice(index, 1);
      this.$emit('change', list);
    }
  }

  onSelect (record: BRecord) {
    const selectedIds = this.records.map(record => record.id);
    if (selectedIds.includes(record.id)) {
      this.onRemoveRecord(record);
    } else if (this.multi) {
      this.$emit('change', [ ...this.records, record ]);
    } else {
      this.$emit('change', [ record ]);
    }
  }
}
</script>

<template>
  <div class="d-flex">
    <div class="controls--label flex-fill">
      <div
        v-for="record of records"
        :key="record.id"
        class="d-flex align-items-center"
      >
        <span class="emr-2">
          {{ record.caption }}
        </span>
        <btn-mini variant="secondary" icon="x" @click="onRemoveRecord(record)" />
      </div>
    </div>
    <div>
      <btn-mini variant="primary" icon="plus" @click="modalShown = true" />
    </div>
    <search-b-records-modal
      v-model="modalShown"
      :entity="entity"
      :selected="records"
      @select="onSelect"
    />
  </div>
</template>
