<template>
  <div class="page-content">
    <div class="container">
      <div class="row justify-content-md-center">
        <create-record-form
          class="col-md-8 col-lg-4"
          :title="title"
          :form="formProps"
          @created="onCreated"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { defineFormFields, FormField } from '~/components/Form';
import CreateRecordForm, { FormProps } from '~/components/database/CreateRecordForm.vue';
import { notify } from '~/lib/notifier';

export default Vue.extend({
  components: { CreateRecordForm },
  props: {
    entity: { type: String, required: true },
    fields: { type: Array as PropType<FormField[]>, required: true },
  },
  computed: {
    title (): string {
      return this.$t('db.new.title', {
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
    createQueryBuilder (): any {
      const queryBuilder = (this.$api.queries as any)[this.entity]?.create;
      if (!queryBuilder) {
        notify('error', 'database.NewPage: create query is missing.', { entity: this.entity });
        return;
      }
      return queryBuilder;
    },
    formProps (): Readonly<FormProps> {
      return Object.freeze({
        fields: this.compiledFields,
        createQuery: this.createQueryBuilder,
      });
    },
  },
  methods: {
    onCreated () {
      this.$router.push({ path: '/database' });
    },
  },
});
</script>
