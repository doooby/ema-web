<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import app from '~/lib/app';

@Component
export default class CalendarInput extends Vue {
  @Prop() readonly domId?: string;
  @Prop() readonly disabled?: boolean;
  @Prop() readonly value?: Date;

  @Prop() readonly min?: Date;
  @Prop() readonly max?: Date;

  onChange (value): void {
    this.$emit('change', app.parseDate(value));
  }
}
</script>

<template>
  <b-form-datepicker
    :id="domId"
    :value="value ?? ''"
    :disabled="disabled"

    :locale="$ema.klass.GLOBAL_DATE_LOCALE"
    label-no-date-selected=""
    :min="min ?? ''"
    :max="max ?? ''"

    :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
    @input="onChange"
  />
</template>
