<template>
  <div class="page-content">
    <div class="container">
      <div class="row justify-content-md-center">
        <update-record-form
          class="col-md-8 col-lg-4"
          :form="formProps"
          :title="title"
          @updated="onUpdated"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import UpdateRecordForm, { FormProps } from './UpdateRecordForm.vue';
import { defineFormFields, FormField } from '../Form';
import VueI18n from 'vue-i18n';
import { ApiRequest } from '~/lib/api';
import { notify } from '~/lib/notifier';

export default Vue.extend({
  components: { UpdateRecordForm },
  props: {
    entity: { type: String, required: true },
    fields: { type: Array as PropType<FormField[]>, required: true },
  },
  computed: {
    title (): VueI18n.TranslateResult {
      return this.$t('db.edit.title', { entity: this.$t(`record.${this.entity}.meta.s`) });
    },
    compiledFields (): FormField[] {
      const fields = this.fields.map(field => ({
        ...field,
        caption: field.caption || `record.${this.entity}.${field.name}`,
      }));
      return defineFormFields(...fields);
    },
    queryGet (): (request: ApiRequest, recordId: string) => Promise<any> {
      const query = (this.$api.queries as any)[this.entity]?.get;
      if (!query) {
        notify('error', `database.EditPage: get query is missing for entity ${this.entity}.`);
        return () => Promise.resolve(null);
      }
      return query;
    },
    queryUpdate (): (request: ApiRequest, recordId: string) => Promise<any> {
      const query = (this.$api.queries as any)[this.entity]?.update;
      if (!query) {
        notify('error', `database.EditPage: update query is missing for entity ${this.entity}.`);
        return () => Promise.resolve(null);
      }
      return query;
    },
    formProps (): Readonly<FormProps> {
      return Object.freeze({
        id: this.$route.params.id,
        fields: this.compiledFields,
        requestGet: this.queryGet,
        requestUpdate: this.queryUpdate,
      });
    },
  },
  methods: {
    onUpdated () {
      this.$router.push({ path: '/database' });
    },
  },
});
</script>
