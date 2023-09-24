<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import app from '~/lib/app';

@Component
export default class DayAttendance extends Vue {
  @Prop() readonly originalValue?: string;
  @Prop() readonly currentValue?: string;
  @Prop({ required: true }) readonly options!: app.List<{ value: string, text: string }>;

  get value (): string {
    return this.currentValue ?? (this.originalValue || '-');
  }
}
</script>

<template>
  <b-form-select
    :class="[currentValue !== undefined && 'border-warning']"
    :options="options"
    :value="value"
    @change="$emit('change', $event)"
  />
</template>
