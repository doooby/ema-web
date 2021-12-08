<template>
  <div class="page-content">
    <div class="container">
      <div class="row justify-content-md-center">
        <h2 class="col-md-8 col-lg-4">
          <t value="db.page.new.title" />
          <span> </span>
          <t :value="`db.record.${entity}.meta.s`" />
        </h2>
      </div>
      <div class="row justify-content-md-center">
        <form-group
          v-model="formValues"
          :class="$scopedSlots.layout ? '' : 'col-md-8 col-lg-4'"
          :fields="formFields"
          :label-prefix="formFieldsLabelPrefix"
        >
          <template v-if="$scopedSlots.layout" #layout="{ context, values }">
            <slot name="layout" :context="context" :values="values" />
          </template>
        </form-group>
      </div>
      <div class="row justify-content-md-center">
        <div class="col-md-8 col-lg-4 text-right">
          <span v-if="createQueryState.running">
            <t value="app.processing" />
          </span>
          <b-button
            variant="success"
            :disabled="createQueryState.running"
            @click="saveRecord"
          >
            <t value="app.action.save" />
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
import { buildFormFields, FormFieldDefinition, formToRecordParams, prefillFormValues } from '~/components/Form';
import { RecordChange, RecordError } from '~/lib/api/mappers';
import RecordErrors from './RecordErrors.vue';

@Component({
  components: { RecordErrors },
})
export default class NewPage extends Vue {
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ required: true }) readonly fields!: FormFieldDefinition[];

  formFields = buildFormFields(this.fields);
  formValues = prefillFormValues(this.formFields);
  createQueryState = this.$api.newQueryState<RecordChange>();
  errors = null as null | RecordError[];

  @Watch('entity')
  @Watch('fields')
  onPageChanged () {
    this.updatePage();
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

  onCreated (recordId: any) {
    if (this.$listeners.created) {
      this.$emit('created', recordId);
    } else {
      this.$router.push({ path: `/database/${this.entity}` });
    }
  }

  updatePage () {
    this.formFields = buildFormFields(this.fields);
    this.formValues = prefillFormValues(this.formFields);
    this.createQueryState.reset();
    this.errors = null;
  }

  async saveRecord () {
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
}
</script>
