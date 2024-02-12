<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import app from '~/lib/app';

@Component
export default class OptionsSelect extends Vue {
  @Prop() readonly domId?: string;
  @Prop() readonly disabled?: boolean;
  @Prop() readonly value?: app.OptionItem[];
  @Prop({ required: true }) readonly options!: app.OptionItem[];
  @Prop() readonly multiple?: boolean;
  @Prop({ default: 150 }) readonly maxHeight?: number;

  get sanitizedValue (): app.OptionItem[] {
    if (this.multiple) {
      if (Array.isArray(this.value)) return this.value;
    } else if (Array.isArray(this.value) && this.value[0]) {
      return this.value.slice(0, 1);
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
      if (!this.multiple) {
        newValue = [ option ];
      } else {
        newValue = [ ...this.sanitizedValue, option ];
      }
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
  <div
    class="d-flex border"
    :style="{
      overflowY: 'scroll',
      maxHeight: `${$props.maxHeight}px`,
    }"
  >
    <ul
      v-if="$scopedSlots.options"
      class="w-100 list-group list-group-flush"
    >
      <slot
        name="options"
        :options="options"
        :is-selected="isSelected"
        :on-toggle-option="onToggleOption"
      />
    </ul>
    <ul
      v-else
      class="w-100 list-group list-group-flush"
    >
      <li
        v-for="option in options"
        :key="option.value"
        :class="[
          'list-group-item list-group-item-action py-1 px-2 font-14',
          isSelected(option) && 'active',
        ]"
        style="cursor: pointer;"
        @click="onToggleOption(option)"
      >
        <slot
          name="option-content"
          :option="option"
          :selected="isSelected(option)"
        />
      </li>
    </ul>
  </div>
</template>
