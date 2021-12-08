<template>
  <div class="page-content">
    <div class="container">
      <div class="row justify-content-md-center">
        <h2 class="col-md-8 col-lg-6">
          <t value="db.page.edit.title" />
          <span> </span>
          <t :value="`db.record.${entity}.meta.s`" />
        </h2>
      </div>
      <div v-if="!record && !fetchQueryState.fail" class="row justify-content-md-center">
        <div class="col-md-8 col-lg-6">
          <b-alert show variant="info">
            <t value="app.loading" />
          </b-alert>
        </div>
      </div>

      <form-group
        v-if="$scopedSlots.layout"
        v-model="formValues"
        class="row justify-content-md-center"
        :fields="formFields"
        :label-prefix="formFieldsLabelPrefix"
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
          :label-prefix="formFieldsLabelPrefix"
        />
      </div>

      <div class="row justify-content-md-center">
        <div class="col-md-8 col-lg-6 text-right">
          <span v-if="saveQueryState.running">
            <t value="app.processing" />
          </span>
          <b-button
            variant="success"
            :disabled="!record || saveQueryState.running"
            @click="saveRecord"
          >
            <t value="app.action.save" />
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
import { buildFormFields, FormFieldDefinition, formToRecordParams, prefillFormValues } from '../Form';
import { RecordChange, RecordError } from '~/lib/api/mappers';

@Component({
  components: { RecordErrors },
})
export default class EditPage extends Vue {
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ required: true }) readonly fields!: FormFieldDefinition[];

  formFields = buildFormFields(this.fields);
  formValues = prefillFormValues(this.formFields);
  fetchQueryState = this.$api.newQueryState();
  saveQueryState = this.$api.newQueryState<RecordChange>();
  errors = null as null | RecordError[];

  @Watch('entity')
  @Watch('recordId')
  @Watch('fields')
  onPageChanged () {
    this.updatePage();
  }

  @Watch('record')
  onRecordChanged (newValue: any) {
    if (newValue) this.formValues = prefillFormValues(this.formFields, newValue);
  }

  mounted () {
    this.updatePage();
  }

  get recordId () {
    const route = this.$route as any;
    return route.params.id;
  }

  get record (): undefined | any {
    return this.fetchQueryState.value?.record;
  }

  get formFieldsLabelPrefix (): string {
    return `db.record.${this.entity}.label`;
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

  onUpdated (record: any) {
    if (this.$listeners.updated) {
      this.$emit('updated', record);
    } else {
      this.$router.push({ path: '/database' });
    }
  }

  async updatePage () {
    const formFields = buildFormFields(this.fields);
    this.formFields = formFields;
    this.formValues = prefillFormValues(formFields);
    this.fetchQueryState.reset();
    this.saveQueryState.reset();
    this.errors = null;
    await this.$api.request(
      this.fetchQuery(),
      this.fetchQueryState,
    );
  }

  async saveRecord () {
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
}
</script>
