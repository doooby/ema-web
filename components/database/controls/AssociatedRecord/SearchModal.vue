<template>
  <div>
    <div>
      <form-group
        :fields="searchFields"
        label-prefix="db.control.associated_record"
        @input="onInputDebounced"
      />
    </div>
    <b-list-group>
      <b-list-group-item
        v-for="record in options"
        :key="record.id"
        :active="selectedId === record.id"
        button
        @click="$emit('select', record)"
      >
        {{ record.labels.caption }}
        <div v-for="[label, value] in labelsOfRecord(record)" :key="label">
          <small>{{ label }}: {{ value }}</small>
        </div>
      </b-list-group-item>
    </b-list-group>
    <b-alert variant="secondary" :show="options === null">
      loading ...
    </b-alert>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import debounce from 'lodash/debounce';
import { buildFormFields } from '~/components/Form';
import { AssociatedRecord } from '~/lib/api/mappers';

export default Vue.extend({
  props: {
    fetchQuery: { type: Function, required: true },
    fetchParams: { type: Object, default: undefined },
    selectedId: { type: Number, default: undefined },
  },
  data () {
    return {
      fetchQueryState: this.$api.newQueryState<any>(),
      searchFields: buildFormFields([
        [ 'name', 'text', { leftLabel: { text: '🔍' }, interactive: true } ],
      ]),
    };
  },
  computed: {
    options (): null | any[] {
      if (this.fetchQueryState.value) {
        return this.fetchQueryState.value.records;
      } else {
        return null;
      }
    },
  },
  mounted () {
    this.fetchOptions();
    setTimeout(
      () => (this.$el.querySelector('#name') as any)?.focus(),
      200,
    );
  },
  methods: {
    onInputDebounced: debounce(
      function (searchValue) {
        // @ts-ignore
        this.fetchOptions(searchValue);
      },
      800,
    ),
    fetchOptions (searchValue: any = undefined) {
      if (this.fetchQueryState.running) return;
      this.$api.request(
        this.fetchQuery?.({
          ...searchValue,
          ...this.fetchParams,
        }),
        this.fetchQueryState,
      );
    },
    labelsOfRecord (record: AssociatedRecord): [string, string][] {
      const list: [string, string][] = [];
      for (const [ name, value ] of Object.entries(record.labels)) {
        if (name === 'caption') continue;
        if (value) list.push([ name, value ]);
      }
      return list;
    },
  },
});
</script>
