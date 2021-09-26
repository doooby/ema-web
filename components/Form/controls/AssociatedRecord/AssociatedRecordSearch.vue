<template>
  <div>
    <div>
      <form-group
        :fields="searchFields"
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
        {{ record.caption }}
        <div v-for="(label, i) in record.labels" :key="i">
          <small>{{ label }}</small>
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

export default Vue.extend({
  props: {
    fetchQuery: { type: Function, required: true },
    selectedId: { type: Number, default: undefined },
  },
  data () {
    return {
      fetchQueryState: this.$api.newQueryState<any>(),
      searchFields: [
        [ 'name', 'controlledText', { leftLabel: '🔍' } ],
      ],
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
    fetchOptions (params: any = undefined) {
      if (this.fetchQueryState.running) return;
      this.$api.request2(this.fetchQueryState, this.fetchQuery?.(params));
    },
  },
});
</script>
