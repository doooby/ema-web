<template>
  <div class="page-content">
    <div class="container pt-4 pb-5">
      <div class="row justify-content-md-center">
        <div class="col-md-8 col-lg-6">
          <div class="card">
            <div class="card-header">
              <h2 class="m-0">
                <t value="db.page.edit.title" />
              &#32;
                <t :value="`db.record.${entity}.meta.s`" />
              </h2>
            </div>
            <div class="position-relative">
              <div class="position-absolute w-100" style="z-index: 1;">
                <b-progress
                  v-if="getQueryState.running"
                  height="2px"
                  :value="100"
                  variant="info"
                  striped
                  animated
                />
                <b-alert v-if="getQueryState.fail" show variant="warning">
                  <b-icon icon="exclamation-triangle-fill" class="mr-3" />
                  <t value="app.record_not_found" />
                </b-alert>
              </div>
            </div>
            <div class="card-body pt-3 pb-0">
              <form-group
                v-if="$scopedSlots.layout"
                v-model="formValues"
                :fields="formFields"
                :label-prefix="formFieldsLabelPrefix"
              >
                <template #layout="{ context, values }">
                  <slot name="layout" :context="context" :values="values" />
                </template>
              </form-group>
              <form-group
                v-else
                v-model="formValues"
                :fields="formFields"
                :label-prefix="formFieldsLabelPrefix"
              />
              <record-errors class="mb-3" :errors="errors" />
            </div>
            <div class="card-footer d-flex justify-content-between">
              <div>
                <b-button variant="outline-success" :disabled="isControlsDisabled" @click="onSubmit">
                  <t value="app.action.save" />
                </b-button>
              </div>
              <div>
                <b-button variant="outline-secondary" :disabled="isControlsDisabled" @click="onCancel">
                  <t value="app.action.cancel" />
                </b-button>
              </div>
            </div>
          </div>
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
  getQueryState = this.$api.newQueryState();
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

  get recordLoadFailed (): boolean {
    const recordGet = this.getQueryState.value;
    return recordGet ? !recordGet.success : false;
  }

  get record (): undefined | any {
    return this.getQueryState.value?.record;
  }

  get formFieldsLabelPrefix (): string {
    return `db.record.${this.entity}.label`;
  }

  get getQuery (): any {
    const entity = this.entity;
    const query = (this.$api.queries as any)[entity]?.show;
    if (query) return () => query(this.recordId);
    return function () {
      utils.raise(new Error(`database.EditPage: get/show query is missing for ${entity}`));
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

  get isControlsDisabled (): boolean {
    return !this.record ||
      this.saveQueryState.running ||
      !!this.saveQueryState.value?.success;
  }

  onUpdated (record: any) {
    if (this.$listeners.updated) {
      this.$emit('updated', record);
    } else {
      this.$router.push({ path: `/database/${this.entity}` });
    }
  }

  async updatePage () {
    const formFields = buildFormFields(this.fields);
    this.formFields = formFields;
    this.formValues = prefillFormValues(formFields);
    this.getQueryState.reset();
    this.saveQueryState.reset();
    this.errors = null;
    await this.$api.request(
      this.getQuery(),
      this.getQueryState,
    );
  }

  async onSubmit () {
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

  onCancel () {
    this.$router.go(-1);
  }
}
</script>
