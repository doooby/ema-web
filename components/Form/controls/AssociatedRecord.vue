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
    <b-modal v-model="modalShown" hide-footer :title="label">
      <associated-record-search
        :fetch-query="fetchQuery"
        @select="onItemSelected"
      />
    </b-modal>
  </b-form-group>
</template>

<script lang="ts">
import Vue from 'vue';
import { FIELD_PROPS } from '..';
import AssociatedRecordSearch from './AssociatedRecord/AssociatedRecordSearch.vue';

export default Vue.extend({
  components: { AssociatedRecordSearch },
  props: FIELD_PROPS,
  data () {
    return {
      modalShown: false,
    };
  },
  computed: {
    valueText (): string {
      const value = this.formValues[this.field[0]];
      return value ? value.caption : '';
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
      this.modalShown = true;
    },
    onItemSelected (record: any) {
      this.modalShown = false;
      this.$emit('change', record);
    },
  },
});
</script>
