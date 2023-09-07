<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import RecordErrors, { mapErrors } from '~/components/database/RecordErrors.vue';
import { buildFormFields, FormFieldDefinition, formToRecordParams, FormValues, prefillFormValues } from '../../../Form';
import { ErrorMessage, SearchRecordsResponsePayload, UpdatedRecordResponsePayload } from '~/lib/api2';
import LoadedPage from '~/components/database/pages/LoadedPage.vue';
import ARecordLink from '~/components/database/components/ARecordLink.vue';
import LoadRecordFail from '~/components/database/components/LoadRecordFail.vue';

@Component({
  components: { LoadRecordFail, ARecordLink, LoadedPage, RecordErrors },
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
    else this.formValues = {};
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

  get errors (): undefined | ErrorMessage[] {
    return mapErrors(
      this.saveQueryState2.response,
      payload => payload.record_id === undefined ? payload.errors : undefined,
    );
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

<template>
  <LoadedPage>
    <div class="container pt-4 pb-5">
      <h4 class="mb-3">
        <nuxt-link
          :to="`/database/${entity}`"
        >
          <t :value="`db.record.${entity}.meta.p`" />
        </nuxt-link>
      </h4>

      <div :class="['card', cardClass]">

        <div class="card-header d-flex align-items-center">
          <h2 class="m-0">
            <t value="db.page.edit.title" />
              &#32;
            <t :value="`db.record.${entity}.meta.s`" />
          </h2>
          <div class="ml-3">
            <a-record-link :id="recordId" :entity="entity" />
          </div>
        </div>

        <div class="card-body">
          <div
            v-if="getQueryState2.processing"
            class="spinner-border"
            role="status"
          >
            <span class="sr-only">Loading...</span>
          </div>

          <div v-if="record">
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
            <RecordErrors :entity="entity" :errors="errors" />
          </div>

          <LoadRecordFail
            v-else
            :query="getQueryState2"
          />
        </div>

        <div class="card-footer d-flex justify-content-between">
          <div>
            <b-button
              variant="outline-success"
              :disabled="!record || saveQueryState2.processing"
              @click="onSubmit"
            >
              <t value="app.action.save" />
            </b-button>
          </div>
          <div>
            <b-button
              variant="outline-secondary"
              :disabled="saveQueryState2.processing"
              @click="onCancel"
            >
              <t value="app.action.cancel" />
            </b-button>
          </div>
        </div>

      </div>

    </div>
  </LoadedPage>
</template>
