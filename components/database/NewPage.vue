<template>
  <div class="page-content">
    <div class="container">
      <div class="row justify-content-md-center">
        <h2 class="col-md-8 col-lg-4">
          {{ title }}
        </h2>
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
          <span v-if="createQueryState.running">
            {{ $t('db.shared.processing') }}
          </span>
          <b-button
            variant="success"
            :disabled="createQueryState.running"
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
import { buildFormFields, FormFieldDefinition, formToRecordParams, prefilledFormValues } from '~/components/Form';
import { RecordChange, RecordError } from '~/lib/api/mappers';
import RecordErrors from './RecordErrors.vue';

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
      createQueryState: this.$api.newQueryState<RecordChange>(),
      errors: null as null | RecordError[],
    };
  },
  computed: {
    title (): string {
      return this.$t('db.new.title', {
        entity: this.$t(`record.${this.entity}.meta.s`),
      }) as string;
    },
    saveQuery (): any {
      const entity = this.entity;
      const query = (this.$api.queries as any)[entity]?.create;
      if (query) return query;
      return function () {
        utils.raise(new Error(`database.NewPage: create query is missing for ${entity}`));
      };
    },
  },
  watch: {
    entity () { this.reset(); },
    fields () { this.reset(); },
  },
  methods: {
    reset () {
      const formFields = buildFormFields(this.fields);
      this.formFields = formFields;
      this.formValues = prefilledFormValues(formFields);
      this.createQueryState.reset();
      this.errors = null;
    },
    async save () {
      if (this.createQueryState.running) return;
      this.errors = null;
      const params = formToRecordParams(this.formFields, this.formValues);
      const result = await this.$api.request(
        this.saveQuery(params),
        this.createQueryState,
      );
      if (result?.success) {
        this.onCreated(result.record_id);
      } else if (result?.errors) {
        this.errors = result.errors;
      } else {
        this.errors = [ [ 'base', 'unknown fail' ] ];
      }
    },
    onCreated (recordId: any) {
      if (this.noDefaultRedirect) {
        this.$emit('created', recordId);
      } else {
        this.$router.push({ path: '/database' });
      }
    },
  },
});
</script>
