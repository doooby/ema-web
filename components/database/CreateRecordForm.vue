<template>
  <div :class="$attrs.class">
    <h2>
      {{ title }}
    </h2>
    <form-view
      v-model="formValues"
      :fields="form.fields"
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
import { createFormModel, FormField, formModelToRecordParams, View as FormView } from '~/components/Form';
import RecordErrors from './RecordErrors.vue';
import { RecordError, RecordChange } from '~/lib/api/mappers';
import { QueryDefinition } from '~/lib/api';

export interface FormProps {
  fields: FormField[];
  createQuery: (...args: any[]) => QueryDefinition<RecordChange>;
}

export default Vue.extend({
  components: {
    FormView,
    RecordErrors,
  },
  props: {
    form: {
      type: Object as PropType<Readonly<FormProps>>,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  data () {
    return {
      formValues: createFormModel(),
      createQueryState: this.$api.newQueryState<RecordChange>(),
      errors: null as null | RecordError[],
    };
  },
  watch: {
    form () { this.reset(); },
  },
  methods: {
    async save () {
      if (this.createQueryState.running) return;
      this.errors = null;
      const { createQuery, fields } = this.form;
      const params = formModelToRecordParams(fields, this.formValues);
      const result = await this.$api.request(createQuery?.(params), this.createQueryState);
      if (result?.success) {
        this.$emit('created', result.record_id);
      } else if (result?.errors) {
        this.errors = result.errors;
      } else {
        this.errors = [ [ 'base', 'unknown fail' ] ];
      }
    },
    reset () {
      this.formValues = createFormModel();
      this.createQueryState.reset();
      this.errors = null;
    },
  },
});
</script>
