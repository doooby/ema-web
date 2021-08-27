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
    <b-modal v-model="modalShown" centered :title="label">
      <b-form-checkbox-group
        v-model="selected"
        :options="options"
        :name="`${domId}_checks`"
        stacked
      />
      <template #modal-footer>
        <div class="d-flex justify-content-end">
          <b-button
            variant="secondary"
            @click="modalShown = false"
          >
            Close
          </b-button>
        </div>
      </template>
    </b-modal>
  </b-form-group>
</template>

<script lang="ts">
import Vue from 'vue';
import { FIELD_PROPS } from '..';

export default Vue.extend({
  props: FIELD_PROPS,
  data () {
    const options = ((this.field[2] as any)?.options || []).map(({ value, caption }: any) => ({
      value,
      text: caption,
    }));
    return {
      options,
      modalShown: false,
      selected: buildSelected(options, this.formValues[this.field[0]]),
    };
  },
  computed: {
    valueText (): string {
      return `Selected: ${this.selected.length}`;
    },
    // options (): Array<{ value: string, text: string }> {
    //   return ((this.field[2] as any)?.options || []).map(({ value, caption }) => ({
    //     value,
    //     text: caption,
    //   }));
    // },
  },
  watch: {
    modalShown (newValue: any) {
      if (!newValue) {
        this.$emit('change', this.selected.join(','));
      }
    },
    formValues (newFormValues) {
      this.selected = buildSelected(this.options, newFormValues[this.field[0]]);
    },
  },
  methods: {
    onChevronClick () {
      this.modalShown = true;
    },
  },
});

function buildSelected (options: any, value: any): string[] {
  const selected = [];
  const values = String(value).split(',');
  for (const value of values) {
    const option = value && options.find((option: any) => option.value === value);
    if (option) selected.push(option.value);
  }
  return selected;
}

</script>
