<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class CheckBox extends Vue {
  @Prop() readonly domId?: string;
  @Prop() readonly disabled?: boolean;
  @Prop() readonly value?: boolean;

  onChange (newValue: boolean) {
    if (newValue !== this.value) {
      this.$emit('input', newValue);
      this.$emit('change', newValue);
    }
  }
}
</script>

<template>
  <b-form-checkbox
    :id="domId"
    :disabled="disabled"
    :class="$attrs.class"
    size="lg"
    :checked="!!value"
    @change="onChange"
  >
    <slot />
  </b-form-checkbox>
</template>
