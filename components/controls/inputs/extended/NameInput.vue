<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class NameInput extends Vue {
  @Prop() readonly domId?: string;
  @Prop() readonly disabled?: boolean;
  @Prop() readonly value?: string[];
  @Prop() readonly placeholder?: string;

  onChange (index, event: { target: HTMLInputElement }): void {
    this.invokeChange(index, event.target.value);
  }

  onSubmit (index, event: { target: HTMLInputElement }): void {
    this.invokeChange(index, event.target.value);
    this.$emit('submit');
  }

  invokeChange (index, text) {
    let newValue = this.value;
    if (newValue) newValue = [ ...newValue ];
    else newValue = [];

    if (newValue[index] !== text) {
      newValue[index] = text;
      this.$emit('change', newValue);
    }
  }
}
</script>

<template>
  <div :class="$attrs.class">
    <div class="input-group">
      <div class="input-group-prepend">
        <span class="input-group-text">
          <t value="form.field.name.en" />
        </span>
      </div>
      <input
        :id="domId"
        type="text"
        class="form-control"
        :value="value?.[0]"
        :disabled="disabled"
        autocomplete="off"
        @blur="onChange(0, $event)"
        @keypress.exact.enter.stop="onChange(0, $event)"
        @keypress.ctrl.enter.stop="onSubmit(0, $event)"
      >
    </div>

    <div class="input-group emt-1">
      <div class="input-group-prepend">
        <span class="input-group-text">
          <t value="form.field.name.local" />
        </span>
      </div>
      <input
        :id="`${domId}_local`"
        type="text"
        class="form-control"
        :value="value?.[1]"
        :disabled="disabled"
        autocomplete="off"
        @blur="onChange(1, $event)"
        @keypress.exact.enter.stop="onChange(1, $event)"
        @keypress.ctrl.enter.stop="onSubmit(1, $event)"
      >
    </div>
  </div>
</template>
