<template>
  <div class="d-flex button-like" @click="modalShown = true">
    <div class="flex-fill text-truncate form--control-label">
      <show-record-link
        v-if="linkRecord"
        :entity="entity"
        :record="linkRecord"
        :in-new-tab="true"
      />
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
        :build-query="onBuildSearchQuery"
        @select="onSelectRecord"
      />
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import SearchModal from '~/components/database/SearchModal.vue';
import * as mappers from '~/lib/api/mappers';
import ShowRecordLink from '~/components/database/ShowRecordLink.vue';

@Component({
  components: { SearchModal, ShowRecordLink },
})
export default class AbbreviatedRecordSelect extends Vue {
  @Prop({ required: true }) readonly entity!: string;
  @Prop() readonly record?: mappers.AbbreviatedRecord;

  modalShown = false;

  get selectedRecords (): mappers.AbbreviatedRecord[] {
    return this.record ? [ this.record ] : [];
  }

  get linkRecord () {
    if (!this.record) return null;
    if (this.record.labels) {
      return {
        id: this.record.id,
        caption: this.record.labels.caption,
      };
    } else {
      return this.record;
    }
  }

  onBuildSearchQuery () {
    return {
      path: `/${this.entity}`,
      mapper: mappers.paginatedAbbreviatedRecords,
    };
  }

  onSelectRecord (record: mappers.AbbreviatedRecord) {
    this.modalShown = false;
    this.$emit('select', record);
  }
}
</script>
