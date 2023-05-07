<template>
  <b-form-select
    :id="domId"
    :value="value"
    :options="translatedOptions"
    multiple
    @change="$emit('input', $event)"
  />
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import app from '~/lib/app';

@Component
export default class SelectMultipleInput extends Vue {
  @Prop({ default: () => undefined }) readonly domId?: string;
  @Prop({ required: true }) readonly value!: any[];
  @Prop({ required: true }) readonly options!: app.Option[];

  get translatedOptions () {
    return this.options.map((option: any) => ({
      value: option.value,
      text: option.text ?? this.$t(option.textKey),
    }));
  }
}
</script>
