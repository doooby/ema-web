<template>
  <div class="page-content">
    <div class="container">
      <div class="row justify-content-md-center">
        <create-record-form
          class="col-md-8 col-lg-4"
          :title="title"
          :form-fields="mappedFields"
          :persist-query="saveQuery"
          @created="onCreated"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { FormField } from '~/components/Form';
import CreateRecordForm from '~/components/database/CreateRecordForm.vue';

export default Vue.extend({
  components: { CreateRecordForm },
  props: {
    entity: { type: String, required: true },
    fields: { type: Array as PropType<FormField[]>, required: true },
    noDefaultRedirect: { type: Boolean, default: false },
  },
  computed: {
    title (): string {
      return this.$t('db.new.title', {
        entity: this.$t(`record.${this.entity}.meta.s`),
      }) as string;
    },
    mappedFields (): FormField[] {
      return this.fields.map(([ name, type, opts ]) => [
        name,
        type,
        { ...(opts || {}), label: () => { return this.$t(`record.${this.entity}.${name}`) as string; } },
      ]);
    },
    saveQuery (): any {
      const entity = this.entity;
      const query = (this.$api.queries as any)[entity]?.create;
      if (query) return query;
      return function () {
        utils.raise(new Error(`database.NewPage: create query is missing for ${entity}`));
      };
    },
  },
  methods: {
    onCreated (recordId: Number) {
      if (this.noDefaultRedirect) {
        this.$emit('created', recordId);
      } else {
        this.$router.push({ path: '/database' });
      }
    },
  },
});
</script>
