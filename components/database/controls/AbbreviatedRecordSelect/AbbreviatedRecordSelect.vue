<template>
  <div class="d-flex button-like" @click="modalShown = true">
    <div class="flex-fill text-truncate form--control-label">
      {{ record && record.labels.caption }}
    </div>
    <b-button v-if="record" variant="secondary" @click.stop="$emit('select', null)">
      <b-icon icon="x" />
    </b-button>
    <b-button variant="secondary">
      <b-icon icon="chevron-down" />
    </b-button>
    <b-modal v-model="modalShown" hide-footer>
      <template #modal-title>
        <slot name="modal-title" />
      </template>
      <search-modal
        v-if="modalShown"
        :selected-records="selectedRecords"
        :build-query="onBuildQuery"
        @select="onSelectRecord($event)"
      />
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import SearchModal from '~/components/database/SearchModal.vue';
import * as mappers from '~/lib/api/mappers';

@Component({
  components: { SearchModal },
})
export default class AbbreviatedRecordSelect extends Vue {
  @Prop({ required: true }) readonly entity!: string;
  @Prop() readonly record?: mappers.AbbreviatedRecord;

  modalShown = false;

  get selectedRecords (): mappers.AbbreviatedRecord[] {
    return this.record ? [ this.record ] : [];
  }

  onBuildQuery () {
    return {
      path: `/${this.entity}`,
      mapper: payload => mappers.paginatedAbbreviatedRecords(payload),
    };
  }

  onSelectRecord (record: mappers.AbbreviatedRecord) {
    this.$emit('select', record);
    this.modalShown = false;
  }
}
</script>
