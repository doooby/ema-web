<template>
  <div :class="$attrs.class">
    <form-view
      v-model="formValues"
      :fields="formFields"
      :record="record"
    />
    <div class="text-right">
      <span v-if="persistQueryState.running">
        {{ $t('db.shared.processing') }}
      </span>
      <b-button
        variant="success"
        :disabled="persistQueryState.running"
        @click="save"
      >
        {{ $t('db.shared.save') }}
      </b-button>
    </div>
    <record-errors :errors="errors" />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import {
  createFormModel,
  View as FormView,
  FormField2,
  formToRecordParams,
} from '~/components/Form';
import RecordErrors from '~/components/database/RecordErrors.vue';
import { RecordError, RecordChange } from '~/lib/api/mappers';

export default Vue.extend({
  components: { FormView, RecordErrors },
  props: {
    title: { type: String, required: true },
    record: { type: Object as PropType<any>, required: true },
    formFields: { type: Array as PropType<FormField2 []>, required: true },
    persistQuery: { type: Function, required: true },
  },
  data () {
    return {
      formValues: createFormModel(this.formFields, this.record),
      persistQueryState: this.$api.newQueryState<RecordChange>(),
      errors: null as null | RecordError[],
    };
  },
  watch: {
    record () { this.reset(); },
  },
  methods: {
    async save () {
      if (this.persistQueryState.running) return;
      this.errors = null;
      const params = formToRecordParams(this.formFields, this.formValues);
      const result = await this.$api.request(
        this.persistQuery(params),
        this.persistQueryState,
      );
      if (result?.success) {
        this.$emit('updated', this.record);
      } else if (result?.errors) {
        this.errors = result.errors;
      } else {
        this.errors = [ [ 'base', 'unknown fail' ] ];
      }
    },
    reset () {
      this.formValues = createFormModel(this.formFields, this.record);
      this.persistQueryState.reset();
      this.errors = null;
    },
  },
});
</script>
