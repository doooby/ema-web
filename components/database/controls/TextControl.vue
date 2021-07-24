<template>
  <div
    :class="$props.class"
  >
    <b-input-group :size="size">
      <b-form-input
        v-model="localValue"
        :placeholder="placeholder"
        @input="debouncedInput"
      />
      <b-input-group-append>
        <b-button
          variant="default"
          class="control-like border-left-0"
          @click="onClear"
        >
          <b-icon-x variant="secondary" />
        </b-button>
      </b-input-group-append>
    </b-input-group>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import debounce from 'lodash/debounce';
import { BIconX } from 'bootstrap-vue';

const debouncedInput = debounce(
  function (this: any, value: string) {
    this.onInput(value);
  },
  400,
);
export default Vue.extend({
  components: { BIconX },
  props: {
    value: { type: String, required: true },
    placeholder: { type: String, required: true },
    size: { type: String, default: undefined },
  },
  data () {
    return {
      localValue: this.value,
    };
  },
  methods: {
    onInput (value: string) {
      this.$emit('input', value);
    },
    debouncedInput,
    onClear () {
      this.localValue = '';
      this.debouncedInput('');
    },
  },
});
</script>
