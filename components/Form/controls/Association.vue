<template>
  <b-form-group
    :label="labelText"
    :label-for="domId"
  >
    <div class="d-flex">
      <div class="flex-fill text-truncate --assoc-control--text">
        {{ valueText }}
      </div>
      <b-dropdown variant="secondary" right class="--assoc-control--dropdown" @show="fetchOptions">
        <b-dropdown-item
          v-for="{record, text} in options"
          :key="record.id"
          @click="inItemSelected(record)"
        >
          {{ text }}
        </b-dropdown-item>
      </b-dropdown>
    </div>
  </b-form-group>
</template>

<script lang="ts">
import Vue from 'vue';
import { FIELD_PROPS } from '../constants';
import { fieldCaptionGet } from '..';
import { AssociationControl } from '~/components/Form/types';
import { notify } from '~/lib/notifier';

interface Item {
  record: any;
  text: string;
}

export default Vue.extend({
  props: FIELD_PROPS,
  data () {
    return {
      options: null as null | Item[],
      fetchQueryState: this.$api.newQueryState<any>(),
    };
  },
  computed: {
    controlSettings (): null | AssociationControl {
      const control = this.field.control;
      if (typeof control !== 'object' || control.type !== 'assoc') return null;
      return control as AssociationControl;
    },
    labelText (): string {
      return this.$t(fieldCaptionGet(this.field)) as string;
    },
    valueText (): string {
      if (!this.controlSettings) return '';
      const value = this.formValues[this.field.name];
      if (value) {
        return value.caption;
      }
      return '-';
    },
    fetchQueryBuilder (): any {
      if (this.controlSettings) {
        const { entity } = this.controlSettings;
        const queryBuilder = (this.$api.queries as any)[entity]?.searchAssociated;
        if (queryBuilder) return queryBuilder;
      }

      notify('error', 'Form.controls.Association: query not found', {
        entity: this.controlSettings?.entity,
      });
      return null;
    },
  },
  methods: {
    async fetchOptions () {
      if (this.options !== null) return;
      if (this.fetchQueryState.running) return;
      const result = await this.$api.request(this.fetchQueryBuilder?.(), this.fetchQueryState);
      if (result !== null) {
        this.options = result.records.map((record: any) => ({
          record,
          text: record.caption,
        }));
      }
    },
    inItemSelected (record: any) {
      this.$emit('change', record);
    },
  },
});
</script>
