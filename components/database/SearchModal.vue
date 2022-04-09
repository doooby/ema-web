<template>
  <div>
    <div>
      <form-group
        :fields="searchFields"
        label-prefix="db.search_modal.fields"
        @input="onInputDebounced"
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
    <b-alert variant="secondary" :show="listedOptions === null">
      loading ...
    </b-alert>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { AssociatedRecord } from '~/lib/api/mappers';
import { QueryDefinition } from '~/lib/api';
import { buildFormFields } from '~/components/Form';
import debounce from 'lodash/debounce';

interface SearchResult {
 records: AssociatedRecord[];
}

interface Item {
  alreadySelected: boolean;
  record: AssociatedRecord;
  labels: [string, string][];
}

@Component
export default class SearchModal extends Vue {
  @Prop({ required: true }) readonly query!: (params?: any) => QueryDefinition<SearchResult>;
  @Prop({ default: undefined }) readonly params: any;
  @Prop({ required: true }) readonly selectedIds!: number[];

  queryState = this.$api.newQueryState<SearchResult>();

  searchFields = buildFormFields([
    [ 'name', 'text', { leftLabel: { text: '🔍' }, interactive: true } ],
  ]);

  onInputDebounced = debounce(
    params => this.search(params),
    800,
  );

  mounted () {
    this.search();
    setTimeout(
      () => (this.$el.querySelector('#name') as any)?.focus(),
      200,
    );
  }

  get listedOptions (): null | Item[] {
    if (!this.queryState.value) return null;
    return this.queryState.value.records.map((record) => {
      const alreadySelected = this.selectedIds.includes(record.id);
      const labels: [string, string][] = [];
      for (const [ name, value ] of Object.entries(record.labels)) {
        if (name === 'caption') continue;
        if (value) labels.push([ name, value ]);
      }
      return { alreadySelected, record, labels };
    });
  }

  search (params: any = undefined) {
    if (this.queryState.running) return;
    this.$api.request(
      this.query({ ...params, ...this.params }),
      this.queryState,
    );
  }
}
</script>
