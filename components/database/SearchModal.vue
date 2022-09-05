<template>
  <div>
    <div>
      <form-group
        :fields="searchFields"
        label-prefix="db.search_modal.fields"
        @input="onInputDebounced"
      />
    </div>
    <loader-strip :request-state="queryState" />
    <div class="emb-2 d-flex justify-content-between">
      <div>
        <t value="db.record.shared.label.records_count" />
        <span>: </span>
        <span>{{ cachedQueryState.value?.total ?? 0 }}</span>
      </div>
      <browsing-pagination
        :request-state="cachedQueryState"
        @select="search({ page: $event })"
      />
    </div>
    <b-list-group>
      <b-list-group-item
        v-for="({ alreadySelected, record, labels}) in listedOptions"
        :key="record.id"
        :active="alreadySelected"
        :button="!alreadySelected"
        @click="!alreadySelected && $emit('select', record)"
      >
        {{ record.labels.caption }}
        <div v-for="[label, value] in labels" :key="label">
          <small>{{ label }}: {{ value }}</small>
        </div>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Params, QueryDefinition } from '~/lib/api';
import { buildFormFields } from '~/components/Form';
import debounce from 'lodash/debounce';
import * as mappers from '~/lib/api/mappers';
import Pagination from '~/components/database/RecordsBrowsing/Pagination.vue';
import LoaderStrip from '~/components/database/LoaderStrip.vue';

type SearchResult = mappers.PaginatedRecords<mappers.AbbreviatedRecord>;

interface Item {
  alreadySelected: boolean;
  record: mappers.AbbreviatedRecord;
  labels: [string, string][];
}

@Component({
  components: {
    BrowsingPagination: Pagination,
    LoaderStrip,
  },
})
export default class SearchModal extends Vue {
  @Prop({ required: true }) readonly selectedRecords!: mappers.AbbreviatedRecord[];
  @Prop({ required: true }) readonly buildQuery!: () => QueryDefinition<SearchResult>;

  searchParams: Params = {};
  queryState = this.$api.newQueryState<SearchResult>();
  cachedQueryState = this.$api.newQueryState<SearchResult>();

  searchFields = buildFormFields([
    [ 'search', 'text', {
      leftLabel: { text: '🔍' },
      interactive: true,
      label: 'app.action.search',
    },
    ],
  ]);

  onInputDebounced = debounce(
    (params) => {
      this.searchParams = params;
      this.search();
    },
    800,
  );

  mounted () {
    this.search();
  }

  get listedOptions (): Item[] {
    const validRecords = this.cachedQueryState.value?.records.filter(
      record => !('__invalid' in record),
    ) as mappers.AbbreviatedRecord[];
    if (!validRecords?.length) return [];

    const selectedIds = this.selectedRecords.map(r => r.id);
    return validRecords.map((record) => {
      const alreadySelected = selectedIds.includes(record.id);
      const labels: [string, string][] = [];
      for (const [ name, value ] of Object.entries(record.labels)) {
        if (name === 'caption') continue;
        if (value) labels.push([ name, value ]);
      }
      return { alreadySelected, record, labels };
    });
  }

  async search (params?: Params) {
    const query = this.buildQuery();
    query.params = {
      ...query.params,
      ...this.searchParams,
      ...params,
      country_id: this.$store.getters['session/countryId'],
      abbr: true,
    };

    this.queryState = this.$api.newQueryState<SearchResult>();
    await this.$api.request(
      query,
      this.queryState,
    );
    this.cachedQueryState = this.queryState;
  }
}
</script>
