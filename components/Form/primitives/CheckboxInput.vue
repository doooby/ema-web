<template>
  <b-form-checkbox
    size="lg"
    :checked="inputChecked"
    @change="onChange"
  >
    <slot />
  </b-form-checkbox>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class CheckboxInput extends Vue {
  @Prop({ default: () => undefined }) readonly domId?: string;
  @Prop({ required: true }) readonly value!: any;

  get inputChecked (): boolean {
    return !!this.value;
  }

  onChange (value: boolean) {
    this.$emit('change', value);
  }
}
</script>
