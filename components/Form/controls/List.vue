<template>
  <b-form-group
    :label="labelText"
    :label-for="domId"
  >
    <div class="d-flex" @click="onChevronClick">
      <div class="flex-fill text-truncate --assoc-control--text">
        {{ valueText }}
      </div>
      <b-button variant="secondary">
        <b-icon icon="chevron-down" />
      </b-button>
    </div>
    <b-modal v-model="modalShown" centered hide-footer :title="labelText">
      <b-list-group>
        <b-list-group-item
          v-for="option in options"
          :key="option.value"
          button
          @click="onItemSelected(option)"
        >
          {{ option.caption }}
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
import { FIELD_PROPS } from '../constants';
import { fieldCaptionGet } from '..';
import { ListControl } from '~/components/Form/types';

export default Vue.extend({
  props: FIELD_PROPS,
  data () {
    return {
      modalShown: false,
      fetchQueryState: this.$api.newQueryState<any>(),
    };
  },
  computed: {
    controlSettings (): null | ListControl {
      const control = this.field.control;
      if (typeof control !== 'object' || control.type !== 'list') return null;
      return control as ListControl;
    },
    labelText (): string {
      return this.$t(fieldCaptionGet(this.field)) as string;
    },
    valueText (): string {
      if (!this.options) return '';
      const value = this.formValues[this.field.name];
      const option = value && this.options.find(option => option.value === value);
      if (option) {
        return option.caption;
      }
      return '';
    },
    options (): any[] {
      if (!this.controlSettings) return [];
      return this.controlSettings.options;
    },
  },
  methods: {
    onChevronClick () {
      this.modalShown = true;
    },
    onItemSelected (option: any) {
      this.modalShown = false;
      this.$emit('change', option.value);
    },
  },
});
</script>
