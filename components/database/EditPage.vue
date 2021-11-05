<template>
  <div class="page-content">
    <div v-if="!pageAllowed" class="container-fluid emy-4">
      <b-alert show variant="info">
        {{ $t('db.shared.not_admissible') }}
      </b-alert>
    </div>
    <div v-else class="container">
      <div class="row justify-content-md-center">
        <h2 class="col-md-8 col-lg-6">
          {{ title }}
        </h2>
      </div>
      <div v-if="!record && !fetchQueryState.fail" class="row justify-content-md-center">
        <div class="col-md-8 col-lg-6">
          <b-alert show variant="info">
            {{ $t('db.shared.loading') }}
          </b-alert>
        </div>
      </div>

      <form-group
        v-if="$scopedSlots.layout"
        v-model="formValues"
        class="row justify-content-md-center"
        :fields="formFields"
      >
        <template #layout="{ context, values }">
          <slot name="layout" :context="context" :values="values" />
        </template>
      </form-group>
      <div
        v-else
        class="row justify-content-md-center"
      >
        <form-group
          v-model="formValues"
          class="col-md-8 col-lg-6"
          :fields="formFields"
        />
      </div>

      <div class="row justify-content-md-center">
        <div class="col-md-8 col-lg-6 text-right">
          <span v-if="saveQueryState.running">
            {{ $t('db.shared.processing') }}
          </span>
          <b-button
            variant="success"
            :disabled="!record || saveQueryState.running"
            @click="save"
          >
            {{ $t('db.shared.save') }}
          </b-button>
        </div>
      </div>
      <div class="row justify-content-md-center">
        <div class="col-md-8 col-lg-6">
          <record-errors :errors="errors" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import RecordErrors from '~/components/database/RecordErrors.vue';
import { buildFormFields, FormFieldDefinition, formToRecordParams, prefilledFormValues } from '../Form';
import { RecordChange, RecordError } from '~/lib/api/mappers';

@Component({
  components: { RecordErrors },
})
export default class EditPage extends Vue {
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ required: true }) readonly fields!: FormFieldDefinition[];
  @Prop({ default: () => false }) readonly noDefaultRedirect!: boolean;

  formFields = buildFormFields(this.fields);
  formValues = prefilledFormValues(this.formFields);
  fetchQueryState = this.$api.newQueryState();
  saveQueryState = this.$api.newQueryState<RecordChange>();
  errors = null as null | RecordError[];

  mounted () {
    if (this.pageAllowed) this.fetchRecord();
  }

  @Watch('entity')
  onEntityChanged () {
    this.reset();
  }

  @Watch('recordId')
  onRecordIdChanged () {
    this.reset();
  }

  @Watch('fields')
  onFieldsChanged () {
    this.reset();
  }

  @Watch('record')
  onRecordChanged (newValue: any) {
    if (newValue) this.formValues = prefilledFormValues(this.formFields, newValue);
  }

  get pageAllowed (): boolean {
    return this.$store.getters['session/isPageAllowed'];
  }

  get title (): string {
    return this.$t('db.edit.title', {
      entity: this.$t(`record.${this.entity}.meta.s`),
    }) as string;
  }

  get recordId () {
    const route = this.$route as any;
    return route.params.id;
  }

  get record (): undefined | any {
    return this.fetchQueryState.value?.record;
  }

  get fetchQuery (): any {
    const entity = this.entity;
    const query = (this.$api.queries as any)[entity]?.show;
    if (query) return () => query(this.recordId);
    return function () {
      utils.raise(new Error(`database.EditPage: fetch query is missing for ${entity}`));
    };
  }

  get saveQuery (): any {
    const entity = this.entity;
    const query = (this.$api.queries as any)[entity]?.update;
    if (query) return (params: any) => query(this.recordId, params);
    return function () {
      utils.raise(new Error(`database.EditPage: update query is missing for ${entity}`));
    };
  }

  reset () {
    const formFields = buildFormFields(this.fields);
    this.formFields = formFields;
    this.formValues = prefilledFormValues(formFields);
    this.fetchQueryState.reset();
    this.saveQueryState.reset();
    this.errors = null;
    this.fetchRecord();
  }

  async fetchRecord () {
    await this.$api.request(
      this.fetchQuery(),
      this.fetchQueryState,
    );
  }

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
  }

  onUpdated (record: any) {
    if (this.noDefaultRedirect) {
      this.$emit('updated', record);
    } else {
      this.$router.push({ path: '/database' });
    }
  }
}
</script>
