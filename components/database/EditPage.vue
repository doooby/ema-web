<template>
  <div class="page-content">
    <div class="container">
      <div class="row justify-content-md-center">
        <h2 class="col-md-8 col-lg-4">
          {{ title }}
        </h2>
      </div>
      <div v-if="!record && !fetchQueryState.fail" class="row justify-content-md-center">
        <div class="col-md-8 col-lg-4">
          <b-alert show variant="info">
            {{ $t('db.shared.loading') }}
          </b-alert>
        </div>
      </div>
      <div class="row justify-content-md-center">
        <form-group
          v-model="formValues"
          :class="$scopedSlots.layout ? '' : 'col-md-8 col-lg-4'"
          :fields="formFields"
        >
          <template v-if="$scopedSlots.layout" #layout="{ context, values }">
            <slot name="layout" :context="context" :values="values" />
          </template>
        </form-group>
      </div>
      <div class="row justify-content-md-center">
        <div class="col-md-8 col-lg-4 text-right">
          <span v-if="saveQueryState.running">
            {{ $t('db.shared.processing') }}
          </span>
          <b-button
            variant="success"
            :disabled="saveQueryState.running"
            @click="save"
          >
            {{ $t('db.shared.save') }}
          </b-button>
        </div>
      </div>
      <div class="row justify-content-md-center">
        <div class="col-md-8 col-lg-4">
          <record-errors :errors="errors" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import RecordErrors from '~/components/database/RecordErrors.vue';
import { buildFormFields, FormFieldDefinition, formToRecordParams, prefilledFormValues } from '../Form';
import { RecordChange, RecordError } from '~/lib/api/mappers';

export default Vue.extend({
  components: { RecordErrors },
  props: {
    entity: { type: String, required: true },
    fields: { type: Array as Vue.PropType<FormFieldDefinition[]>, required: true },
    noDefaultRedirect: { type: Boolean, default: false },
  },
  data () {
    const formFields = buildFormFields(this.fields);
    return {
      formFields,
      formValues: prefilledFormValues(formFields),
      fetchQueryState: this.$api.newQueryState(),
      saveQueryState: this.$api.newQueryState<RecordChange>(),
      errors: null as null | RecordError[],
    };
  },
  computed: {
    title (): string {
      return this.$t('db.edit.title', {
        entity: this.$t(`record.${this.entity}.meta.s`),
      }) as string;
    },
    recordId () {
      const route = this.$route as any;
      return route.params.id;
    },
    record (): undefined | any {
      return this.fetchQueryState.value?.record;
    },
    fetchQuery (): any {
      const entity = this.entity;
      const query = (this.$api.queries as any)[entity]?.show;
      if (query) return () => query(this.recordId);
      return function () {
        utils.raise(new Error(`database.EditPage: fetch query is missing for ${entity}`));
      };
    },
    saveQuery (): any {
      const entity = this.entity;
      const query = (this.$api.queries as any)[entity]?.update;
      if (query) return (params: any) => query(this.recordId, params);
      return function () {
        utils.raise(new Error(`database.EditPage: update query is missing for ${entity}`));
      };
    },
  },
  watch: {
    entity () { this.reset(); },
    recordId () { this.reset(); },
    fields () { this.reset(); },
    record (newValue: any) {
      if (newValue) this.formValues = prefilledFormValues(this.formFields, newValue);
    },
  },
  mounted () {
    this.fetchRecord();
  },
  methods: {
    reset () {
      const formFields = buildFormFields(this.fields);
      this.formFields = formFields;
      this.formValues = prefilledFormValues(formFields);
      this.fetchQueryState.reset();
      this.saveQueryState.reset();
      this.errors = null;
      this.fetchRecord();
    },
    async fetchRecord () {
      await this.$api.request(
        this.fetchQuery(),
        this.fetchQueryState,
      );
    },
    async save () {
      if (this.saveQueryState.running) return;
      this.errors = null;
      const params = formToRecordParams(this.formFields, this.formValues);
      const result = await this.$api.request(
        this.saveQuery(params),
        this.saveQueryState,
      );
      if (result?.success) {
        this.onUpdated(this.record);
      } else if (result?.errors) {
        this.errors = result.errors;
      } else {
        this.errors = [ [ 'base', 'unknown fail' ] ];
      }
    },
    onUpdated (record: any) {
      if (this.noDefaultRedirect) {
        this.$emit('updated', record);
      } else {
        this.$router.push({ path: '/database' });
      }
    },
  },
});
</script>
