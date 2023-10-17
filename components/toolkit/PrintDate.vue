<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import app from '~/lib/app';

@Component
export default class PrintDate extends Vue {
  @Prop() readonly value?: Date;

  get textEnUk () {
    return formatDateInEnglish(this.value);
  }
}

function formatDateInEnglish (date?: Date) {
  if (!date) return '';
  return app.locales.createDateTimeFormat(
    app.locales.INTL_GLOBAL,
  ).format(date);
}
</script>

<template>
  <div :class="$attrs.class">
    <div v-if="value">
      {{ $ema.localizeDate(value) }}
    </div>
    <div
      v-if="value && !$ema.localeIsEn"
      class="font-12"
    >
      {{ textEnUk }}
    </div>
  </div>
</template>
