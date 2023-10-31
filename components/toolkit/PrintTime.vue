<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import app from '~/lib/app';

@Component
export default class PrintDate extends Vue {
  @Prop() readonly value?: Date;

  time_opts = app.locales.TIME_OPTS;

  get textEnUk () {
    return formatDateInEnglish(this.value);
  }
}

function formatDateInEnglish (date?: Date) {
  if (!date) return '';
  return app.locales.createDateTimeFormat(
    app.locales.INTL_GLOBAL, app.locales.TIME_OPTS,
  ).format(date);
}
</script>

<template>
  <div :class="$attrs.class">
    <div v-if="value">
      {{ $ema.localizeDate(value, time_opts) }}
    </div>
    <div
      v-if="value && !$ema.intlDateLocaleIsEnUk"
      class="font-12"
    >
      {{ textEnUk }}
    </div>
  </div>
</template>
