<template>
  <b-form-group
    :label-for="domIdBase"
  >
    <template #label>
      <t :value="labelTranslation" />
    </template>
    <div class="d-flex align-items-center">
      <checkbox-input
        v-if="requireable"
        class="mr-2"
        :value="fieldValue !== undefined"
        @change="onRequireChange"
      >
        <t value="app.common.label.required" />
      </checkbox-input>
      <div class="input-group">
        <div v-if="leftLabelText" class="input-group-prepend">
          <span v-if="leftLabelText.text" class="input-group-text">
            {{ leftLabelText.text }}
          </span>
          <span v-if="leftLabelText.t" class="input-group-text">
            <t :value="leftLabelText.t" />
          </span>
        </div>
        <integer-input
          :dom-id="domIdBase"
          :value="fieldValue"
          :max-length="maxLength"
          :disabled="requireable && fieldValue === undefined"
          @change="onChange"
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
    </div>
  </b-form-group>
</template>

<script lang="ts">
import Vue from 'vue';
import { FormFieldType, FormField, FormValues, FormGroupContext } from '..';
import ControlMixin from '../ControlMixin';
import IntegerInput from '~/components/Form/primitives/IntegerInput.vue';
import CheckboxInput from '~/components/Form/primitives/CheckboxInput.vue';

export const type: FormFieldType = {
  name: 'integer',
  fillParams ({ name }, values, record) {
    record[name] = values[name] || '';
    return record;
  },
};

export default Vue.extend({
  components: { IntegerInput, CheckboxInput },
  mixins: [ ControlMixin ],
  props: {
    field: { type: Object as Vue.PropType<FormField>, required: true },
    context: { type: Object as Vue.PropType<FormGroupContext>, required: true },
    formValues: { type: Object as Vue.PropType<FormValues>, required: true },
  },
  computed: {
    fieldValue () {
      return this.formValues[this.field.name];
    },
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
    maxLength (): undefined | number {
      const value = this.field.options.maxLength;
      return typeof value === 'number' ? value : undefined;
    },
    requireable (): boolean {
      return !!this.field.options.requireable;
    },
  },
  methods: {
    onChange (newValue: any): void {
      this.context.onChange({ [this.field.name]: newValue });
    },
    onRequireChange (check: boolean) {
      const newValue = check ? '' : undefined;
      this.context.onChange({ [this.field.name]: newValue });
    },
  },
});
</script>
