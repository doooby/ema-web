<template>
  <div>
    <b-form-select
      :id="domId"
      :value="sanitizedValue[0]"
      :options="optionsWithOther"
      @change="onSelect"
    />
    <input
      v-if="sanitizedValue[0] === otherOption"
      :id="`${domId}_fill`"
      type="text"
      class="form-control emt-1"
      :value="sanitizedValue[1]"
      autocomplete="off"
      @blur="onFill"
    >
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import app from '~/lib/app';

const OTHER_OPTION = '_other';

@Component
export default class SelectOrFillInput extends Vue {
  @Prop({ default: () => undefined }) readonly domId?: string;
  @Prop({ required: true }) readonly value!: any;
  @Prop({ required: true }) readonly options!: app.Option[];

  otherOption = OTHER_OPTION;

  get sanitizedValue (): [string, undefined | string] {
    if (Array.isArray(this.value)) {
      return [
        this.value[0],
        this.value[1],
      ];
    } else {
      return [ '', undefined ];
    }
  }

  get optionsWithOther () {
    return [
      ...this.options.map(option => ({
        value: option.value,
        text: this.$t(option.textKey),
      })),
      { value: OTHER_OPTION, text: this.$t('app.common.label.other') as string },
    ];
  }

  onSelect (value: string) {
    this.$emit('input', [ value, undefined ]);
  }

  onFill (event: any) {
    this.$emit('input', [ OTHER_OPTION, event.target.value ]);
  }
}
</script>
