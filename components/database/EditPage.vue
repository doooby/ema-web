<template>
  <div class="page-content">
    <div class="container">
      <div class="row justify-content-md-center">
        <div class="col-md-8 col-lg-4">
          <h2 class="text-center">
            {{ title }}
          </h2>
          <update-record-form
            :form="formProps"
            :title="title"
            @updated="onUpdated"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import UpdateRecordForm, { FormProps } from './UpdateRecordForm.vue';
import { defineFormFields, FormField } from '../Form';
import { notify } from '~/lib/notifier';

export default Vue.extend({
  components: { UpdateRecordForm },
  props: {
    entity: { type: String, required: true },
    fields: { type: Array as PropType<FormField[]>, required: true },
    noDefaultRedirect: { type: Boolean, default: false },
  },
  computed: {
    title (): string {
      return this.$t('db.edit.title', {
        entity: this.$t(`record.${this.entity}.meta.s`),
      }) as string;
    },
    compiledFields (): FormField[] {
      const fields = this.fields.map(field => ({
        ...field,
        caption: field.caption || `record.${this.entity}.${field.name}`,
      }));
      return defineFormFields(fields);
    },
    getQueryBuilder (): any {
      const queryBuilder = (this.$api.queries as any)[this.entity]?.get;
      if (!queryBuilder) {
        notify('error', 'database.EditPage: get query is missing.', { entity: this.entity });
        return;
      }
      return queryBuilder;
    },
    updateQueryBuilder (): any {
      const queryBuilder = (this.$api.queries as any)[this.entity]?.update;
      if (!queryBuilder) {
        notify('error', 'database.EditPage: update query is missing.', { entity: this.entity });
        return;
      }
      return queryBuilder;
    },
    formProps (): Readonly<FormProps> {
      return Object.freeze({
        id: Number(this.$route.params.id),
        fields: this.compiledFields,
        getQuery: this.getQueryBuilder,
        updateQuery: this.updateQueryBuilder,
      });
    },
  },
  methods: {
    onUpdated (recordId: Number) {
      if (this.noDefaultRedirect) {
        this.$emit('success', recordId);
      } else {
        this.$router.push({ path: '/database' });
      }
    },
  },
});
</script>
