<template>
  <loaded-page class="page-content">
    <div class="container pt-4 pb-5">
      <h4 class="mb-3">
        <nuxt-link
          :to="`/database/${entity}`"
        >
          <t :value="`db.record.${entity}.meta.p`" />
        </nuxt-link>
      </h4>

      <div class="row">
        <div class="col justify-content-md-center">
          <div :class="['card', cardClass]">
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
                :value="formValues"
                :fields="formFields"
                :label-prefix="formFieldsLabelPrefix"
                @input="onInput"
              >
                <template #layout="{ context, values }">
                  <slot name="layout" :context="context" :values="values" />
                </template>
              </form-group>
              <record-errors class="mb-3" :entity="entity" :errors="errors" />
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
  </loaded-page>
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
import LoadedPage from '~/components/database/pages/LoadedPage.vue';

@Component({
  components: { LoadedPage, RecordErrors },
})
export default class New2Page extends Vue {
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ required: true }) readonly fields!: FormFieldDefinition[];
  @Prop() readonly processing?: boolean;
  @Prop() readonly value!: FormValues;
  @Prop() readonly cardClass?: string;
  @Prop() readonly showAfterCreate?: boolean;

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
    return this.createQueryState2.processing;
  }

  get errors (): null | [string, string][] {
    const response = this.createQueryState2.response;
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

  onCreated (recordId: string) {
    if (this.showAfterCreate) {
      this.$router.push({ path: `/database/${this.entity}/${recordId}` });
    } else if (this.$listeners.create) {
      this.$emit('create', recordId);
    } else {
      this.$router.push({ path: `/database/${this.entity}` });
    }
  }

  onInput (newValues: any) {
    const previousValues = this.formValues;
    this.formValues = { ...previousValues, ...newValues };
    this.$emit('change', this.formValues);
  }

  async onSubmit () {
    if (this.createQueryState2.processing) return;
    const params = formToRecordParams(this.formFields, this.formValues);
    params.country_id = this.$store.getters['session/countryId'];
    await this.$api2.request(
      this.createQueryState2,
      this.$api2.getQuery(this.entity, 'create')(params),
    );
    if (this.createQueryState2.response?.ok &&
      this.createQueryState2.response.payload.record_id
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
