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
      if (!this.options) return '';
      const value = this.formValues[this.field[0]];
      const option = value && this.options.find(option => option.value === value);
      if (option) {
        return option.caption;
      }
      return '';
    },
    options (): Array<{ value: string, caption: string }> {
      return (this.field[2] as any)?.options || [];
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
