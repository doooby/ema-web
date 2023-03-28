<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import Vue from 'vue';
import { BRecord, SearchRecordsResponsePayload } from '~/lib/api2';
import Pagination from '~/components/database/RecordsBrowsing/Pagination.vue';
import LoaderStrip from '~/components/database/LoaderStrip.vue';
import { RequestState } from '~/lib/api';

interface Item {
  selected: boolean;
  record: BRecord;
  labels: [string, string][];
}

@Component({
  components: {
    BrowsingPagination: Pagination,
    LoaderStrip,
  },
})
export default class SearchBRecordsModal extends Vue {
  @Prop({ default: false }) readonly value!: boolean;
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ required: true }) readonly selected!: BRecord[];
  @Prop({ default: undefined }) readonly title!: string;

  searchValue = '';
  searchQueryState = this.$api2.newQueryState<SearchRecordsResponsePayload<BRecord>>();

  mounted () {
    this.onSearch();
  }

  get searchQueryStateV1 (): RequestState {
    return this.$api2.mapResponseToV1RequestState(this.searchQueryState);
  }

  get items (): Item[] {
    const { response } = this.searchQueryState;

    if (!response || !response.ok) {
      return [];
    }

    const selectedIds = this.selected.map(record => record.id);
    return response.payload.records.map(record => ({
      record,
      selected: selectedIds.includes(record.id),
      labels: bRecordLabels(record),
    }));
  }

  onSearch (page?: number) {
    if (this.searchQueryState.processing) return;

    let query;
    try {
      query = this.$api2.getQuery(this.entity, 'search')({
        b_record: true, page, search: this.searchValue,
      });
    } catch (error) {
      this.searchQueryState.response = {
        ok: false,
        message: 'invalid_query',
        error,
      };
      return;
    }

    this.$api2.request(this.searchQueryState, query);
  }
}

function bRecordLabels ({ caption: _, ...labels }: BRecord) {
  return Object.entries(labels)
    .filter(([ , value ]) => !!value) as [string, string][];
}
</script>

<template>
  <b-modal :visible="value" @hidden="$emit('input', false)">
    <template #modal-title>
      <t :value="title || `db.modals.SearchBRecordsModal.title`" />
    </template>
    <div v-if="value">
      <div>
        <b-form-group
          label-for="SearchBRecords_search"
        >
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">
                🔍
              </span>
            </div>
            <input
              id="SearchBRecords_search"
              v-model="searchValue"
              type="text"
              class="form-control"
              @input="onSearch"
              @keypress.ctrl.enter="onSearch"
            >
          </div>
        </b-form-group>
      </div>
      <loader-strip :request-state="searchQueryStateV1" />
      <div class="emb-2 d-flex justify-content-between">
        <div>
          <t value="db.record.shared.label.records_count" />
          <span>: </span>
          <span>{{ cachedQueryState.value?.total ?? 0 }}</span>
        </div>
        <browsing-pagination
          :request-state="searchQueryStateV1"
          @select="onSearch($event)"
        />
      </div>
      <b-list-group>
        <b-list-group-item
          v-for="({ selected, record, labels }) in items"
          :key="record.id"
          :active="selected"
          button
          @click="$emit('select', record)"
        >
          {{ record.caption }}
          <div v-for="[name, value] in labels" :key="name">
            <small>{{ name }}: {{ value }}</small>
          </div>
        </b-list-group-item>
      </b-list-group>
    </div>
  </b-modal>
</template>
