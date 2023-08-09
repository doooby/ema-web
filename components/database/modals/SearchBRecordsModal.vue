<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator';
import Vue from 'vue';
import { BRecord, SearchRecordsResponsePayload } from '~/lib/api2';
import LoaderStrip from '~/components/database/components/LoaderStrip.vue';
import BRecordLink from '~/components/database/components/BRecordLink.vue';
import SelectPage from '~/components/database/components/listing/SelectPage.vue';

interface Item {
  selected: boolean;
  record: BRecord;
  labels: [string, string][];
}

@Component({
  components: {
    SelectPage,
    LoaderStrip,
    BRecordLink,
  },
})
export default class SearchBRecordsModal extends Vue {
  @Prop({ default: false }) readonly value!: boolean;
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ required: true }) readonly selected!: BRecord[];
  @Prop({ default: undefined }) readonly title!: string;
  @Prop({ default: undefined }) params!: any;

  searchValue = '';
  searchQueryState = this.$api2.newQueryState<SearchRecordsResponsePayload<BRecord>>();

  @Watch('value')
  onValueChange (value) {
    if (value) this.onSearch();
  }

  get payload () {
    if (this.searchQueryState.response?.ok) {
      return this.searchQueryState.response.payload;
    }
  }

  get items (): Item[] {
    const payload = this.payload;

    if (!payload) {
      return [];
    }

    const selectedIds = this.selected.map(record => record.id);
    return payload.records.map(record => ({
      record,
      selected: selectedIds.includes(record.id),
      labels: bRecordLabels(record),
    }));
  }

  onSearch (page?: number) {
    if (this.searchQueryState.processing) return;

    let query;
    try {
      query = this.$api2.getQuery(this.entity, 'searchB')({
        ...this.params,
        country_id: this.$store.getters['session/countryId'],
        page,
        per_page: 10,
        search: this.searchValue,
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

function bRecordLabels ({ caption: _caption, id: _id, ...labels }: BRecord) {
  return Object.entries(labels)
    .filter(([ , value ]) => !!value) as [string, string][];
}
</script>

<template>
  <b-modal
    :visible="value"
    hide-footer
    @hidden="$emit('input', false)"
  >
    <template #modal-title>
      <t :value="title || `db.modals.SearchBRecordsModal.title`" />
    </template>
    <div v-if="value">
      <div>
        <b-form-group
          label-for="SearchBRecords_search"
        >
          <div class="input-group">
            <div
              class="input-group-prepend button-like"
              @click="onSearch()"
            >
              <span class="input-group-text">
                🔍
              </span>
            </div>
            <input
              id="SearchBRecords_search"
              v-model="searchValue"
              type="text"
              class="form-control"
              @keypress.enter="onSearch()"
            >
          </div>
        </b-form-group>
      </div>
      <loader-strip :request-state="searchQueryState" />
      <select-page :request="searchQueryState" @select="onSearch($event)" />
      <div class="mt-2" />
      <b-list-group>
        <b-list-group-item
          v-for="({ selected, record, labels }) in items"
          :key="record.id"
          :active="selected"
          button
          @click="$emit('select', record)"
        >
          <div class="d-flex align-items-center mb-2">
            <b-record-link :entity="entity" :record="record" :show-id="true" :new-tab="true" />
            <h5 class="m-0 ml-2">
              {{ record.caption }}
            </h5>
          </div>
          <div v-for="[name, value] in labels" :key="name">
            <small class="text-black-50">{{ name }}: </small>
            <small>{{ value }}</small>
          </div>
        </b-list-group-item>
      </b-list-group>
    </div>
  </b-modal>
</template>
