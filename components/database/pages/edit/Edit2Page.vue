<template>
  <div class="page-content">
    <div class="container mt-4 mb-5">

      <div class="row">
        <div class="col justify-content-md-center">
          <div :class="['card px-0', cardClass]">

            <div class="card-header">
              <h2 class="m-0">
                <t value="db.page.edit.title" />
              &#32;
                <t :value="`db.record.${entity}.meta.s`" />
              </h2>
            </div>

            <loader-strip :request-state="getQueryState" />
            <div class="card-body pt-3 pb-0">
              <form-group
                :value="formValues"
                :fields="formFields"
                :label-prefix="formFieldsLabelPrefix"
                @input="onInput"
              >
                <template #layout="{ context, values }">
                  <slot name="layout" :context="context" :values="values" />
                </template>
              </form-group>
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
import { buildFormFields, FormFieldDefinition, formToRecordParams, FormValues, prefillFormValues } from '../../../Form';
import LoaderStrip from '~/components/database/LoaderStrip.vue';
import { SearchRecordsResponsePayload, UpdatedRecordResponsePayload } from '~/lib/api2';
import { RequestState } from '~/lib/api';

@Component({
  components: { RecordErrors, LoaderStrip },
})
export default class Edit2Page extends Vue {
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ required: true }) readonly fields!: FormFieldDefinition[];
  @Prop() readonly value!: FormValues;
  @Prop() readonly cardClass?: string;
  @Prop() readonly showAfterUpdate?: boolean;

  formFields = buildFormFields(this.fields);
  formValues = prefillFormValues(this.formFields);
  getQueryState2 = this.$api2.newQueryState<SearchRecordsResponsePayload>();
  saveQueryState2 = this.$api2.newQueryState<UpdatedRecordResponsePayload>();

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

  @Watch('value')
  onValueChanged () {
    this.formValues = { ...this.formValues, ...this.value };
  }

  mounted () {
    this.updatePage();
  }

  get recordId () {
    const route = this.$route as any;
    return route.params.id;
  }

  get record (): undefined | any {
    return (this.getQueryState2.response?.ok &&
      this.getQueryState2.response.payload.records[0]
    ) || undefined;
  }

  get formFieldsLabelPrefix (): string {
    return `db.record.${this.entity}.label`;
  }

  get isControlsDisabled (): boolean {
    throw new Error('nope - FIX !');
    // TODO fix
    // return !this.record ||
    //   this.saveQueryState.running ||
    //   !!this.saveQueryState.value?.success;
  }

  get getQueryState () : RequestState {
    return this.$api2.mapResponseToV1RequestState(this.getQueryState2);
  }

  get errors (): null | [string, string][] {
    const response = this.saveQueryState2.response;
    if (response?.ok === false) {
      return [ [ 'server', response.message ] ];
    }

    if (response?.ok && response.payload.record_id === undefined) {
      if (response.payload.errors.length) {
        return response.payload.errors;
      }
    }

    return null;
  }

  onInput (newValues: any) {
    const previousValues = this.formValues;
    this.formValues = { ...previousValues, ...newValues };
    this.$emit('change', this.formValues, previousValues);
  }

  onUpdated (recordId: string) {
    if (this.showAfterUpdate) {
      this.$router.push({ path: `/database/${this.entity}/${recordId}` });
    } else if (this.$listeners.update) {
      this.$emit('update', recordId);
    } else {
      this.$router.push({ path: `/database/${this.entity}` });
    }
  }

  async updatePage () {
    const formFields = buildFormFields(this.fields);
    this.formFields = formFields;
    this.formValues = prefillFormValues(formFields);
    await this.onLoadRecord();
    this.saveQueryState2.response = undefined;
    this.saveQueryState2.processing = false;
  }

  async onLoadRecord () {
    if (this.getQueryState2.processing) return;
    await this.$api2.request(
      this.getQueryState2,
      this.$api2.getQuery(this.entity, 'search')({
        id: this.recordId,
        per_page: 1,
      }),
    );
  }

  async onSubmit () {
    if (this.saveQueryState2.processing) return;
    const params = formToRecordParams(this.formFields, this.formValues);
    await this.$api2.request(
      this.saveQueryState2,
      this.$api2.getQuery(this.entity, 'update')(this.recordId, params),
    );
    if (this.saveQueryState2.response?.ok &&
      this.saveQueryState2.response.payload.record_id
    ) {
      this.onUpdated(this.saveQueryState2.response.payload.record_id);
    }
  }

  onCancel () {
    this.$router.go(-1);
  }
}
</script>
