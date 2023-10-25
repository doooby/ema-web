<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import app from '~/lib/app';
import TextInput from '~/components/controls/inputs/TextInput.vue';

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

  onChange (value): void {
    this.$emit('change', app.parseDate(value));
  }

  onTextChange (value) {
    let newDate: undefined | Date;

    const match = value.match(
      /^\s*(\d{1,2})\s*\/\s*(\d{1,2})\s*\/\s*(\d{1,4})\s*$/,
    );

    try {
      newDate = app.sanitizedDate(
        app.parseDate(
          match
            ? `${match[3]}-${match[2]}-${match[1]}`
            : value,
        ),
      );
    } catch (err) {}

    this.$emit('change', newDate);
  }

  @Watch('value')
  @Watch('$ema.locale')
  onValueChange () {
    this.textValue = this.$ema.localizeDate(this.value) ?? '';
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
      @input="onChange"
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
