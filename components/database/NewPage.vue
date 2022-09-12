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
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import {
  buildFormFields,
  FormFieldDefinition,
  formToRecordParams,
  FormValues,
  prefillFormValues,
} from '~/components/Form';
import { RecordChange, RecordChangeError } from '~/lib/api/mappers';
import RecordErrors from './RecordErrors.vue';

@Component({
  components: { RecordErrors },
})
export default class NewPage extends Vue {
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ required: true }) readonly fields!: FormFieldDefinition[];
  @Prop() readonly processing?: boolean;
  @Prop() readonly value!: FormValues;
  @Prop() readonly cardClass?: string;

  formFields = buildFormFields(this.fields);
  formValues = { ...prefillFormValues(this.formFields), ...this.value };
  createQueryState = this.$api.newQueryState<RecordChange>();
  errors = null as null | RecordChangeError[];

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

  get saveQuery (): any {
    const entity = this.entity;
    const query = (this.$api.queries as any)[entity]?.create;
    if (query) return query;
    return function () {
      utils.raise(new Error(`database.NewPage: create query is missing for ${entity}`));
    };
  }

  get isControlsDisabled (): boolean {
    return this.createQueryState.running ||
      !!this.createQueryState.value?.success;
  }

  onCreated (recordId: any) {
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
  }

  onCancel () {
    this.$router.go(-1);
  }

  updatePage () {
    this.formFields = buildFormFields(this.fields);
    this.formValues = prefillFormValues(this.formFields);
    this.createQueryState.reset();
    this.errors = null;
  }
}
</script>
