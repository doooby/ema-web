<template>
  <div class="page-content">
    <div class="container pt-4 pb-5">
      <div class="row justify-content-md-center">
        <div :class="['card px-0', cardClass]">
          <div class="card-header">
            <h2 class="m-0">
              <t value="db.page.new.title" />
                &#32;
              <t :value="`db.record.${entity}.meta.s`" />
            </h2>
          </div>
          <div class="position-relative">
            <div class="position-absolute w-100" style="z-index: 1;">
              <b-progress
                v-if="processing"
                height="2px"
                :value="100"
                variant="info"
                striped
                animated
              />
            </div>
          </div>
          <div class="card-body pt-3 pb-0">
            <form-group
              v-if="$scopedSlots.layout"
              :value="formValues"
              :fields="formFields"
              :label-prefix="formFieldsLabelPrefix"
              @input="onInput"
            >
              <template #layout="{ context, values }">
                <slot name="layout" :context="context" :values="values" />
              </template>
            </form-group>
            <form-group
              v-else
              :value="formValues"
              :fields="formFields"
              :label-prefix="formFieldsLabelPrefix"
              @input="onInput"
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
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import {
  buildFormFields,
  FormFieldDefinition,
  formToRecordParams,
  FormValues,
  prefillFormValues,
} from '~/components/Form';
import RecordErrors from '../../RecordErrors.vue';
import { UpdatedRecordResponsePayload } from '~/lib/api2';

@Component({
  components: { RecordErrors },
})
export default class New2Page extends Vue {
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ required: true }) readonly fields!: FormFieldDefinition[];
  @Prop() readonly processing?: boolean;
  @Prop() readonly value!: FormValues;
  @Prop() readonly cardClass?: string;

  formFields = buildFormFields(this.fields);
  formValues = { ...prefillFormValues(this.formFields), ...this.value };
  createQueryState2 = this.$api2.newQueryState<UpdatedRecordResponsePayload>();

  @Watch('entity')
  @Watch('fields')
  onPageChanged () {
    this.updatePage();
  }

  @Watch('value')
  onValueChanged () {
    this.formValues = { ...this.formValues, ...this.value };
  }

  mounted () {
    this.updatePage();
  }

  get formFieldsLabelPrefix (): string {
    return `db.record.${this.entity}.label`;
  }

  get isControlsDisabled (): boolean {
    return false;
    // TODO fix
    // return this.createQueryState2.processing ||
    //   !!(this.createQueryState2.response?.ok && this.createQueryState2.response.payload.success);
  }

  get errors (): null | [string, string][] {
    const response = this.createQueryState2.response;
    if (response?.ok === false) {
      return [ [ 'server', response.message ] ];
    }

    if (response?.ok && !response.payload.success) {
      if (response.payload.errors.length) {
        return response.payload.errors;
      }
    }

    return null;
  }

  onCreated (recordId: string) {
    if (this.$listeners.create) {
      this.$emit('create', recordId);
    } else {
      this.$router.push({ path: `/database/${this.entity}` });
    }
  }

  onInput (newValues: any) {
    const previousValues = this.formValues;
    this.formValues = { ...previousValues, ...newValues };
    this.$emit('change', this.formValues, previousValues);
  }

  async onSubmit () {
    if (this.createQueryState2.processing) return;
    const params = formToRecordParams(this.formFields, this.formValues);
    await this.$api2.request(
      this.createQueryState2,
      this.$api2.getQuery(this.entity, 'create')(params),
    );
    if (this.createQueryState2.response?.ok &&
      this.createQueryState2.response.payload.success
    ) {
      this.onCreated(this.createQueryState2.response.payload.record_id);
    }
  }

  onCancel () {
    this.$router.go(-1);
  }

  updatePage () {
    this.formFields = buildFormFields(this.fields);
    this.formValues = prefillFormValues(this.formFields);
    this.createQueryState2.response = undefined;
    this.createQueryState2.processing = false;
  }
}
</script>
