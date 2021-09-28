<template>
  <b-form-group
    :label="labelTranslation"
    :label-for="domIdBase"
  >
    <input
      :id="domIdBase"
      type="text"
      class="form-control"
      :value="sanitizedLocalValue"
      autocomplete="off"
      @blur="onLocalInput"
    >
    <div class="input-group">
      <div class="input-group-prepend">
        <span class="input-group-text">
          {{ $t('misc.language.en') }}
        </span>
      </div>
      <input
        :id="domIdEnglish"
        type="text"
        class="form-control"
        :value="sanitizedEnglishValue"
        autocomplete="off"
        @blur="onEnglishInput"
      >
    </div>
  </b-form-group>
</template>

<script lang="ts">
import Vue from 'vue';
import { FormFieldType, FormField, FormValues, FormGroupContext } from '~/components/Form';
import ControlMixin from '~/components/Form/ControlMixin';

export const type: FormFieldType = {
  mapToValues (field: FormField, record: any, values: FormValues = {}) {
    for (const name of getNamesTuple(field)) {
      values[name] = record[name] ?? undefined;
    }
    return values;
  },
  mapToRecordParams (field: FormField, values: FormValues, record: any = {}) {
    for (const name of getNamesTuple(field)) {
      record[name] = values[name] || '';
    }
    return record;
  },
};

export default Vue.extend({
  mixins: [ ControlMixin ],
  props: {
    field: { type: Object as Vue.PropType<FormField>, required: true },
    context: { type: Object as Vue.PropType<FormGroupContext>, required: true },
    formValues: { type: Object as Vue.PropType<FormValues>, required: true },
  },
  computed: {
    namesTuple (): [ string, string ] {
      return getNamesTuple(this.field);
    },
    domIdEnglish (): string {
      const anyThis = this as any;
      return `${anyThis.domIdBase}_en`;
    },
    sanitizedLocalValue (): string {
      const rawValue = this.formValues[this.namesTuple[0]];
      return rawValue ? String(rawValue) : '';
    },
    sanitizedEnglishValue (): string {
      const rawValue = this.formValues[this.namesTuple[1]];
      return rawValue ? String(rawValue) : '';
    },
  },
  methods: {
    onLocalInput (event: {target: HTMLInputElement}) {
      (this as any).debouncedOnChange({ [this.namesTuple[0]]: event.target.value });
    },
    onEnglishInput (event: {target: HTMLInputElement}) {
      (this as any).debouncedOnChange({ [this.namesTuple[1]]: event.target.value });
    },
  },
});

function getNamesTuple ({ name }: FormField): [ string, string] {
  return [ name, `${name}_en` ];
}
</script>
