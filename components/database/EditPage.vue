<template>
  <div class="page-content">
    <div class="container">
      <div class="row justify-content-md-center">
        <div class="col-md-8 col-lg-4">
          <h2 class="text-center">
            {{ title }}
          </h2>
          <b-alert :show="!record && !fetchQueryState.fail" variant="info">
            {{ $t('db.shared.loading') }}
          </b-alert>
          <b-alert :show="fetchQueryState.fail" variant="warning">
            {{ $t('db.shared.record_not_found') }}
          </b-alert>
          <update-record-form
            v-if="record"
            :title="title"
            :record="record"
            :form-fields="mappedFields"
            :fetch-query="fetchQuery"
            :persist-query="saveQuery"
            @updated="onUpdated"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import UpdateRecordForm from './UpdateRecordForm.vue';
import { FormField } from '../Form';

export default Vue.extend({
  components: { UpdateRecordForm },
  props: {
    entity: { type: String, required: true },
    fields: { type: Array as PropType<FormField[]>, required: true },
    noDefaultRedirect: { type: Boolean, default: false },
  },
  data () {
    return {
      fetchQueryState: this.$api.newQueryState(),
    };
  },
  computed: {
    title (): string {
      return this.$t('db.edit.title', {
        entity: this.$t(`record.${this.entity}.meta.s`),
      }) as string;
    },
    record (): undefined | any {
      return this.fetchQueryState.value?.record;
    },
    mappedFields (): FormField[] {
      return this.fields.map(([ name, type, opts ]) => [
        name,
        type,
        { ...(opts || {}), label: () => { return this.$t(`record.${this.entity}.${name}`) as string; } },
      ]);
    },
    fetchQuery (): any {
      const entity = this.entity;
      const query = (this.$api.queries as any)[entity]?.get;
      if (query) return () => query(this.$route.params.id);
      return function () {
        utils.raise(new Error(`database.EditPage: create query is missing for ${entity}`));
      };
    },
    saveQuery (): any {
      const entity = this.entity;
      const query = (this.$api.queries as any)[entity]?.update;
      if (query) return (params: any) => query(this.$route.params.id, params);
      return function () {
        utils.raise(new Error(`database.EditPage: create query is missing for ${entity}`));
      };
    },
  },
  watch: {
    fetchQuery () {
      this.reset();
    },
  },
  mounted () {
    this.fetchRecord();
  },
  methods: {
    async fetchRecord () {
      await this.$api.request(
        this.fetchQuery(),
        this.fetchQueryState,
      );
    },
    onUpdated (record: any) {
      if (this.noDefaultRedirect) {
        this.$emit('updated', record);
      } else {
        this.$router.push({ path: '/database' });
      }
    },
    reset () {
      this.fetchQueryState.reset();
      this.fetchRecord();
    },
  },
});
</script>
