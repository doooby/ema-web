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
import { ApiRequest, Params } from '~/lib/api';
import { notify } from '~/lib/notifier';
import VueI18n from 'vue-i18n';

export default Vue.extend({
  components: { CreateRecordForm },
  props: {
    entity: { type: String, required: true },
    fields: { type: Array as PropType<FormField[]>, required: true },
  },
  computed: {
    title (): VueI18n.TranslateResult {
      return this.$t('db.new.title', { entity: this.$t(`record.${this.entity}.meta.s`) });
    },
    compiledFields (): FormField[] {
      const fields = this.fields.map(field => ({
        ...field,
        caption: field.caption || `record.${this.entity}.${field.name}`,
      }));
      return defineFormFields(...fields);
    },
    queryCreate (): (request: ApiRequest, record: Params) => Promise<any> {
      const query = (this.$api.queries as any)[this.entity]?.create;
      if (!query) {
        notify('error', `database.BrowsePage: create query is missing for entity ${this.entity}.`);
        return () => Promise.resolve(null);
      }
      return query;
    },
    formProps (): Readonly<FormProps> {
      return Object.freeze({
        fields: this.compiledFields,
        requestCreate: this.queryCreate,
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
