<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { formatDate, parseDate } from '~/lib/global_utils';

@Component
export default class DateInput extends Vue {
  @Prop() readonly domId?: string;
  @Prop() readonly disabled?: boolean;
  @Prop() readonly value?: Date;

  @Prop() readonly min?: Date;
  @Prop() readonly max?: Date;

  get valueString () {
    return formatDate(this.value);
  }

  get minString () {
    return formatDate(this.min);
  }

  get maxString () {
    return formatDate(this.max);
  }

  onChange (event: { target: HTMLInputElement }): void {
    this.$emit('change', parseDate(event.target.value));
  }
}
</script>

<template>
  <input
    :id="domId"
    type="date"
    :class="[ 'form-control', $attrs.class ]"
    :value="valueString"
    :disabled="disabled"
    autocomplete="off"
    :min="minString"
    :max="maxString"
    @change="onChange"
  >
</template>
