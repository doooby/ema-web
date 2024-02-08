<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import app from '~/lib/app';
import TextInput from '~/components/controls/inputs/base/TextInput.vue';
import { padStart } from 'lodash';

@Component({
  components: { TextInput },
})
export default class DateInput extends Vue {
  @Prop() readonly domId?: string;
  @Prop() readonly disabled?: boolean;
  @Prop() readonly value?: Date;

  @Prop() readonly min?: Date;
  @Prop() readonly max?: Date;

  textValue = '';

  created () {
    this.textValue = this.$ema.localizeDate(this.value) ?? '';
  }

  get textEnUk () {
    return formatDateInEnglish(this.value);
  }

  onPick (value): void {
    this.emitChange(app.parseDate(value));
  }

  onTextChange (value) {
    let newDate: undefined | Date;

    const match = value.match(
      /^\s*(\d{1,2})\s*\/\s*(\d{1,2})\s*\/\s*(\d{1,4})\s*$/,
    );

    if (match) {
      const utc_date = [
        padStart(match[3], 4, '0'),
        padStart(match[2], 2, '0'),
        padStart(match[1], 2, '0'),
      ].join('-');
      newDate = app.parseDate(utc_date);
    } else {
      newDate = app.parseDate(value);
    }

    this.emitChange(app.sanitizedDate(newDate));
  }

  @Watch('value')
  @Watch('$ema.locale')
  onValueChange () {
    this.textValue = this.$ema.localizeDate(this.value) ?? '';
  }

  emitChange (newDate: app.Maybe<Date>) {
    if (!newDate) this.textValue = '';
    this.$emit('input', newDate);
    this.$emit('change', newDate);
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
  <div class="d-flex">
    <b-form-datepicker
      class="ema--control--date-input--picker"
      :value="value ?? ''"
      :min="min ?? ''"
      :max="max ?? ''"
      :disabled="disabled"
      :locale="$ema.intlLocale"
      :button-only="true"
      @input="onPick"
    />
    <div
      v-if="!$ema.intlDateLocaleIsEnUk"
      class="px-2 font-14 border-top border-bottom label_en d-flex align-items-center"
    >
      {{ textEnUk }}
    </div>
    <div class="flex-fill">
      <TextInput
        :dom-id="domId"
        :value="textValue"
        :disabled="disabled"
        @change="onTextChange"
      />
    </div>
  </div>
</template>

<style>
.ema--control--date-input--picker > .btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
}
</style>

<style lang="scss" scoped>
@import "assets/css/variables";
.label_en {
  background-color: $input-group-addon-bg;
}
</style>
