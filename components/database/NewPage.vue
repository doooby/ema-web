<template>
  <div class="page-content">
    <div v-if="!pageAllowed" class="container-fluid emy-4">
      <b-alert show variant="info">
        {{ $t('db.shared.not_admissible') }}
      </b-alert>
    </div>
    <div v-else class="container">
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
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { buildFormFields, FormFieldDefinition, formToRecordParams, prefilledFormValues } from '~/components/Form';
import { RecordChange, RecordError } from '~/lib/api/mappers';
import RecordErrors from './RecordErrors.vue';

@Component({
  components: { RecordErrors },
})
export default class NewPage extends Vue {
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ required: true }) readonly fields!: FormFieldDefinition[];
  @Prop({ default: () => false }) readonly noDefaultRedirect!: boolean;

  formFields = buildFormFields(this.fields);
  formValues = prefilledFormValues(this.formFields);
  createQueryState = this.$api.newQueryState<RecordChange>();
  errors = null as null | RecordError[];

  @Watch('entity')
  onEntityChanged () {
    this.reset();
  }

  @Watch('fields')
  onFieldsChanged () {
    this.reset();
  }

  get pageAllowed (): boolean {
    return this.$store.getters['dbPage/allowed'];
  }

  get title (): string {
    return this.$t('db.new.title', {
      entity: this.$t(`record.${this.entity}.meta.s`),
    }) as string;
  }

  get saveQuery (): any {
    const entity = this.entity;
    const query = (this.$api.queries as any)[entity]?.create;
    if (query) return query;
    return function () {
      utils.raise(new Error(`database.NewPage: create query is missing for ${entity}`));
    };
  }

  reset () {
    const formFields = buildFormFields(this.fields);
    this.formFields = formFields;
    this.formValues = prefilledFormValues(formFields);
    this.createQueryState.reset();
    this.errors = null;
  }

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
  }

  onCreated (recordId: any) {
    if (this.noDefaultRedirect) {
      this.$emit('created', recordId);
    } else {
      this.$router.push({ path: '/database' });
    }
  }
}
</script>
