<template>
  <b-form-group
    :label="label"
    :label-for="domId"
  >
    <div class="d-flex" @click="onChevronClick">
      <div class="flex-fill text-truncate association--text">
        {{ valueText }}
      </div>
      <b-button variant="secondary">
        <b-icon icon="chevron-down" />
      </b-button>
    </div>
    <b-modal v-model="modalShown" centered hide-footer :title="label">
      <b-list-group>
        <b-list-group-item
          v-for="record in options"
          :key="record.id"
          button
          @click="onItemSelected(record)"
        >
          {{ record.caption }}
        </b-list-group-item>
      </b-list-group>
      <b-alert variant="secondary" :show="options === null || options.length === 0">
        empty
      </b-alert>
    </b-modal>
  </b-form-group>
</template>

<script lang="ts">
import Vue from 'vue';
import { FIELD_PROPS } from '..';

export default Vue.extend({
  props: FIELD_PROPS,
  data () {
    return {
      modalShown: false,
      fetchQueryState: this.$api.newQueryState<any>(),
    };
  },
  computed: {
    valueText (): string {
      const value = this.formValues[this.field[0]];
      return value ? value.caption : '';
    },
    options (): null | any[] {
      if (this.fetchQueryState.value) {
        return this.fetchQueryState.value.records;
      } else {
        return null;
      }
    },
    fetchQuery (): any {
      const entity = (this.field[2] as any)?.entity;
      const query = entity && (this.$api.queries as any)[entity]?.searchAssociated;
      if (query) return query;

      utils.raise(new Error(`Form.controls.Association: query not found for entity ${entity}`));
      return null;
    },
  },
  methods: {
    onChevronClick () {
      this.fetchOptions();
      this.modalShown = true;
    },
    fetchOptions () {
      if (this.fetchQueryState.running) return;
      this.$api.request(this.fetchQuery?.(), this.fetchQueryState);
    },
    onItemSelected (record: any) {
      this.modalShown = false;
      this.$emit('change', record);
    },
  },
});
</script>
