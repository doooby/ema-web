<template>
  <div :class="$attrs.class">
    <h2>
      {{ title }}
    </h2>
    <form-view
      v-model="formValues"
      :fields="formFields"
    />
    <div class="text-right">
      <span v-if="createQueryState.running">
        processing...
      </span>
      <b-button
        variant="success"
        :disabled="createQueryState.running"
        @click="save"
      >
        Save
      </b-button>
    </div>
    <record-errors :errors="errors" />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { createFormModel, FormField2, formToRecordParams, View as FormView } from '~/components/Form'
import RecordErrors from './RecordErrors.vue';
import { RecordError, RecordChange } from '~/lib/api/mappers';

export default Vue.extend({
  components: {
    FormView,
    RecordErrors,
  },
  props: {
    title: { type: String, required: true },
    formFields: { type: Array as PropType<FormField2 []>, required: true },
    persistQuery: { type: Function, required: true },
  },
  data () {
    return {
      formValues: createFormModel(this.formFields),
      createQueryState: this.$api.newQueryState<RecordChange>(),
      errors: null as null | RecordError[],
    };
  },
  watch: {
    formFields () { this.reset(); },
    persistQuery () { this.reset(); },
  },
  methods: {
    async save () {
      if (this.createQueryState.running) return;
      this.errors = null;
      const params = formToRecordParams(this.formFields, this.formValues);
      const result = await this.$api.request(
        this.persistQuery(params),
        this.createQueryState,
      );
      if (result?.success) {
        this.$emit('created', result.record_id);
      } else if (result?.errors) {
        this.errors = result.errors;
      } else {
        this.errors = [ [ 'base', 'unknown fail' ] ];
      }
    },
    reset () {
      this.formValues = createFormModel(this.formFields);
      this.createQueryState.reset();
      this.errors = null;
    },
  },
});
</script>
