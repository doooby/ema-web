<template>
  <div :class="$attrs.class">
    <b-alert :show="!record && !loadingFailed" variant="info">
      {{ $t('db.shared.loading') }}
    </b-alert>
    <b-alert :show="loadingFailed" variant="warning">
      {{ $t('db.shared.record_not_found') }}
    </b-alert>
    <form-view
      v-if="record"
      v-model="formValues"
      :fields="form.fields"
      :record="record"
    />
    <div v-if="record" class="text-right">
      <span v-if="updateQueryState.running">
        {{ $t('db.shared.processing') }}
      </span>
      <b-button
        variant="success"
        :disabled="updateQueryState.running"
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
import { createFormModel, formModelToRecordParams, FormField, View as FormView } from '~/components/Form';
import RecordErrors from '~/components/database/RecordErrors.vue';
import { RecordError, RecordGet, RecordChange } from '~/lib/api/mappers';
import { QueryDefinition } from '~/lib/api';

export interface FormProps {
  id: number;
  fields: FormField[];
  getQuery: (...args: any[]) => QueryDefinition<RecordGet>;
  updateQuery: (...args: any[]) => QueryDefinition<RecordChange>;
}

export default Vue.extend({
  components: { FormView, RecordErrors },
  props: {
    form: {
      type: Object as PropType<Readonly<FormProps>>,
      required: true,
    },
  },
  data () {
    return {
      getQueryState: this.$api.newQueryState(),
      formValues: createFormModel(),
      updateQueryState: this.$api.newQueryState<RecordChange>(),
      errors: null as null | RecordError[],
    };
  },
  computed: {
    record (): null | any {
      return this.getQueryState.value?.record;
    },
    loadingFailed ():boolean {
      return !!this.getQueryState.error;
    },
  },
  watch: {
    form () { this.reset(); },
  },
  async mounted () {
    const { fields } = this.form;
    await this.getQuery();
    if (this.record) {
      this.formValues = createFormModel(fields, this.record);
    }
  },
  methods: {
    async getQuery () {
      const { id, getQuery } = this.form;
      await this.$api.request(getQuery?.(id), this.getQueryState);
    },
    async save () {
      if (this.updateQueryState.running) return;
      this.errors = null;
      const { id, updateQuery, fields } = this.form;
      const params = formModelToRecordParams(fields, this.formValues);
      const result = await this.$api.request(updateQuery?.(id, params), this.updateQueryState);
      if (result?.success) {
        this.$emit('updated', id);
      } else if (result?.errors) {
        this.errors = result.errors;
      } else {
        this.errors = [ [ 'base', 'unknown fail' ] ];
      }
    },
    reset () {
      this.getQueryState.reset();
      this.formValues = createFormModel();
      this.updateQueryState.reset();
      this.errors = null;
    },
  },
});
</script>
