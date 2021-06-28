<template>
  <b-form-group
    :label="labelText"
    :label-for="domId"
  >
    <div class="d-flex align-items-center">
      <div class="flex-fill --assoc-control--text">
        {{ valueText }}
      </div>
      <b-dropdown variant="secondary" right class="--assoc-control--dropdown" @show="onLoadOptions">
        <b-dropdown-item
          v-for="{record, text} in options.items"
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
import { ApiRequest } from '~/lib/api';
import { notify } from '~/lib/notifier';

interface Item {
  record: any;
  text: string;
}

export default Vue.extend({
  props: FIELD_PROPS,
  data () {
    return {
      options: {
        items: null as null | Item[],
        request: this.$api.createRequestState(),
      },
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
      const { getText } = this.controlSettings;
      const value = this.formValues[this.field.name];
      if (value) {
        return getText ? getText(value) : value.name;
      }
      return '-';
    },
    requestGetOptions (): (request: ApiRequest) => Promise<any> {
      let errorMessage = null;
      if (this.controlSettings) {
        const { entity } = this.controlSettings;
        const query = (this.$api.queries as any)[entity]?.searchAssociated;
        if (query) return query;
        errorMessage = this.controlSettings.entity;
      }
      notify('error', `Form.controls.Association: query not found${errorMessage}`);
      return () => Promise.resolve(null);
    },
  },
  methods: {
    async onLoadOptions () {
      if (!this.controlSettings) return;
      if (this.options.items !== null) return;
      if (this.options.request.running) return;
      const result: any = await this.$api.query(this.options.request, this.requestGetOptions);
      if (result !== null) {
        const { getText } = this.controlSettings;
        this.options.items = result.records.map((record: any) => ({
          record,
          text: getText ? getText(record) : record.name,
        }));
      }
    },
    inItemSelected (record: any) {
      this.$emit('change', record);
    },
  },
});
</script>
