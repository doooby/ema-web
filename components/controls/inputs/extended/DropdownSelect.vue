<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import app from '~/lib/app';

@Component
export default class DropdownSelect extends Vue {
  @Prop() readonly domId?: string;
  @Prop() readonly disabled?: boolean;
  @Prop() readonly value?: app.OptionItem[];
  @Prop({ required: true }) readonly options!: app.OptionItem[];
  @Prop({ default: 150 }) readonly maxHeight?: number;

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

    this.$emit('change', newValue);
  }
}
</script>

<template>
  <b-dropdown
    size="sm"
    variant="outline-secondary"
    :class="[ $attrs.class, 'ema--control--dropdown-select' ]"
  >
    <template #button-content>
      <slot
        name="button-content"
        :option="sanitizedValue?.[0]"
      />
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
div.ema--control--dropdown-select {
  padding: 0;
  > .btn {
    padding: 0 4px;
  }
  > .dropdown-menu {
    overflow-y: scroll;
  }
}
</style>
