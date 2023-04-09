<template>
  <b-form-group
    :label-for="domIdBase"
  >
    <template #label>
      <t :value="labelTranslation" />
    </template>
    <div class="input-group">
      <div v-if="leftLabelText" class="input-group-prepend">
        <span v-if="leftLabelText.text" class="input-group-text">
          {{ leftLabelText.text }}
        </span>
        <span v-if="leftLabelText.t" class="input-group-text">
          <t :value="leftLabelText.t" />
        </span>
      </div>
      <text-input
        :dom-id="domIdBase"
        :interactive="interactive"
        :value="value"
        @input="onChange"
        @submit="onSubmit"
      />
      <div v-if="rightLabelText" class="input-group-append">
        <span v-if="rightLabelText.text" class="input-group-text">
          {{ rightLabelText.text }}
        </span>
        <span v-if="rightLabelText.t" class="input-group-text">
          <t :value="rightLabelText.t" />
        </span>
      </div>
    </div>
  </b-form-group>
</template>

<script lang="ts">
import Vue from 'vue';
import { FormFieldType, FormField, FormValues, FormGroupContext } from '..';
import ControlMixin from '../ControlMixin';
import TextInput from '~/components/Form/primitives/TextInput.vue';

export const type: FormFieldType = {
  name: 'text',
  fillValues ({ name }, record, values) {
    values[name] = record[name] ?? undefined;
    return values;
  },
  fillParams ({ name }, values, record) {
    record[name] = values[name] || '';
    return record;
  },
};

export default Vue.extend({
  components: { TextInput },
  mixins: [ ControlMixin ],
  props: {
    field: { type: Object as Vue.PropType<FormField>, required: true },
    context: { type: Object as Vue.PropType<FormGroupContext>, required: true },
    formValues: { type: Object as Vue.PropType<FormValues>, required: true },
  },
  computed: {
    leftLabelText (): undefined | { text?: string; t?: string } {
      const leftLabel = this.field.options.leftLabel;
      if (!leftLabel) return undefined;
      if (typeof leftLabel === 'object') return leftLabel;
      if (typeof leftLabel === 'function') return leftLabel();
      return { t: String(leftLabel) };
    },
    rightLabelText (): undefined | { text?: string; t?: string } {
      const rightLabel = this.field.options.rightLabel;
      if (!rightLabel) return undefined;
      if (typeof rightLabel === 'object') return rightLabel;
      if (typeof rightLabel === 'function') return rightLabel();
      return { t: String(rightLabel) };
    },
    value (): string {
      return this.formValues[this.field.name];
    },
  },
  methods: {
    onChange (newValue: string) {
      (this as any).debouncedOnChange({ [this.field.name]: newValue });
    },
    onSubmit (value) {
      (this as any).onChangeValue(value);
      this.context.onSubmit();
    },
  },
});
</script>
