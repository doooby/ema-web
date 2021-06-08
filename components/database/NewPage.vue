<template>
  <div class="page-content">
    <div class="container">
      <div class="row justify-content-md-center">
        <create-record-form
          class="col-md-8 col-lg-4"
          :title="title"
          :fields="compiledFields"
          :create-record="query"
          :on-success-route="`/database/${entity}`"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { defineFormFields, FormField } from '~/components/Form';
import CreateRecordForm from '~/components/database/CreateRecordForm.vue';
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
    compiledFields (): Readonly<FormField[]> {
      const fields = this.fields.map(field => ({
        ...field,
        caption: field.caption || `record.${this.entity}.${field.name}`,
      }));
      return defineFormFields(...fields);
    },
    query (): (request: ApiRequest, record: Params) => Promise<null | any> {
      const query = (this.$api.queries as any)[this.entity]?.create;
      if (!query) {
        notify('error', `database.BrowsePage: search query is missing for entity ${this.entity}.`);
        return () => Promise.resolve(null);
      }
      return query;
    },
  },
});
</script>
