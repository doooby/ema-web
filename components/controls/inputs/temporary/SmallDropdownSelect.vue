<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import app from '~/lib/app';

@Component
export default class SmallDropdownSelect extends Vue {
  @Prop() readonly domId?: string;
  @Prop() readonly disabled?: boolean;
  @Prop() readonly value?: app.OptionItem[];
  @Prop({ required: true }) readonly options!: app.OptionItem[];

  get sanitizedValue (): app.OptionItem[] {
    if (Array.isArray(this.value) && this.value[0]) {
      return [ this.value[0] ];
    }

    return [];
  }

  isSelected (option: app.OptionItem): boolean {
    return !!this.sanitizedValue.find(
      item => item.value === option.value,
    );
  }

  onToggleOption (option: app.OptionItem): void {
    this.onSetOption(option, !this.isSelected(option));
  }

  onSetOption (option: app.OptionItem, selected: boolean): void {
    let newValue;

    if (selected) {
      newValue = [ option ];
    } else {
      newValue = this.sanitizedValue.filter(
        ({ value }) => value !== option.value,
      );
    }

    this.$emit('input', newValue);
    this.$emit('change', newValue);
  }
}
</script>

<template>
  <b-dropdown
    size="sm"
    variant="default"
    :class="[
      $attrs.class,
      'ema--control--small-dropdown-select',
    ]"
    no-caret
  >
    <template #button-content>
      <div class="w-100 d-flex">
        <div class="controls--label flex-fill text-truncate">
          <slot
            name="content"
            :option="sanitizedValue?.[0]"
          />
        </div>
        <b-button
          variant="default"
          size="sm"
          class="ema--control--dropdown-select--button"
        >
          <b-icon icon="chevron-down" />
        </b-button>
      </div>
    </template>
    <b-dropdown-item
      v-for="option in options"
      :key="option.value"
      :active="isSelected(option)"
      @click="onToggleOption(option)"
    >
      <slot
        name="option-content"
        :option="option"
        :selected="isSelected(option)"
      />
    </b-dropdown-item>
  </b-dropdown>
</template>

<style lang="scss">
@import "assets/css/variables";
.ema--control--small-dropdown-select {
  padding: 0;
  > .btn {
    padding: 0;
    border: none;
  }
  > .dropdown-menu {
    max-height: 200px;
    overflow-y: scroll;
  }
  .controls--label {
    text-align: start;
    color: $body-color;
    padding: 0 4px;
    height: 20px;
    line-height: 18px;
    background-color: transparent;
    border: none;
  }
  .ema--control--dropdown-select--button {
    padding: 0 2px;
    height: 20px;
    font-size: 80%;
  }
  .dropdown-item {
    padding: 4px 8px;
  }
}
</style>
