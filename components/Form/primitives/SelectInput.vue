<template>
  <b-form-select
    :id="domId"
    :value="selected && selected.value"
    :options="options"
    @change="$emit('input', $event)"
  />
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Option } from '~/lib/types';

@Component
export default class SelectInput extends Vue {
  @Prop({ default: () => undefined }) readonly domId?: string;
  @Prop({ required: true }) readonly value!: any;
  @Prop({ required: true }) readonly options!: Option[];
}
</script>
