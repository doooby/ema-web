<template>
  <b-form-group
    :label="labelText"
  >
    <div class="d-flex align-items-start">
      <div class="ew-13">
        {{ $t('record.students.disability_detail.s') }}
      </div>
      <b-form-select
        v-model="status"
        multiple
        class="eml-2 epx-2 control-like"
        :options="statusOptions"
      />
    </div>
    <div v-if="status.length" class="emt-2 d-flex align-items-center">
      <div class="ew-13">
        {{ $t('record.students.disability_detail.d') }}
      </div>
      <b-form-select
        v-model="diagnosis"
        class="eml-2 epx-2 control-like"
        :options="diagnosisOptions"
      />
    </div>
    <div v-if="status.length" class="emt-2 d-flex align-items-center">
      <div class="ew-13">
        {{ $t('record.students.disability_detail.n') }}
      </div>
      <b-form-radio-group
        v-model="assistance_needed"
        :options="[0, 1]"
      />
    </div>
    <div v-if="status.length" class="emt-2 d-flex align-items-center">
      <div class="ew-13">
        {{ $t('record.students.disability_detail.p') }}
      </div>
      <b-form-radio-group
        v-model="assistance_provided"
        :options="[0, 1]"
      />
    </div>
  </b-form-group>
</template>

<script lang="ts">
import Vue from 'vue';
import { isEqual } from 'lodash';
import { FIELD_PROPS } from '~/components/Form/constants';
import { fieldCaptionGet } from '~/components/Form';

function mapYesNoText (value: any): 'yes' | 'no' {
  return value === 1 ? 'yes' : 'no';
}

export default Vue.extend({
  props: FIELD_PROPS,
  data () {
    const value = this.formValues[this.field.name];
    return {
      value,
      status: value ? value.s.split(',') : [],
      statusOptions: [ 'physical', 'mental', 'deafness', 'blindness', 'other' ],
      diagnosis: value && value.d !== undefined ? mapYesNoText(value.d) : '',
      diagnosisOptions: [ '', 'yes', 'no' ],
      assistance_needed: value && value.n === 1 ? 1 : 0,
      assistance_provided: value && value.p === 1 ? 1 : 0,
    };
  },
  computed: {
    labelText (): string {
      return this.$t(fieldCaptionGet(this.field)) as string;
    },
  },
  watch: {
    status (newValue) {
      if (!newValue.length) {
        this.diagnosis = '';
        this.assistance_needed = '0';
        this.assistance_provided = '0';
      }
      this.recomputeValue();
    },
    diagnosis () {
      this.recomputeValue();
    },
    assistance_needed () {
      this.recomputeValue();
    },
    assistance_provided () {
      this.recomputeValue();
    },
    value () {
      this.$emit('change', this.value);
    },
  },
  methods: {
    recomputeValue () {
      let newValue = undefined as any;
      if (this.status.length) {
        newValue = Object.freeze({
          s: this.status,
          d: this.diagnosis ? (this.diagnosis === 'yes' ? 1 : 0) : undefined,
          n: this.assistance_needed === 1 ? 1 : undefined,
          p: this.assistance_provided === 1 ? 1 : undefined,
        });
      }
      if (!isEqual(this.value, newValue)) {
        this.value = newValue;
      }
    },
  },
});
</script>
