<template>
  <div :class="$attrs.class">
    <h2>
      {{ title }}
    </h2>
    <b-alert :show="!record && !loadingFailed" variant="info">
      ...loading the record
    </b-alert>
    <b-alert :show="loadingFailed" variant="warning">
      Record not found
    </b-alert>
    <form-view
      v-if="record"
      v-model="formValues"
      :fields="fields"
    />
    <div v-if="record" class="text-right">
      <span v-if="updating.running">
        processing...
      </span>
      <b-button
        variant="success"
        :disabled="updating.running"
        @click="save"
      >
        Save
      </b-button>
    </div>
    <record-errors :errors="errors" />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { createFormModel, FormField } from '@c/Form';
import FormView from '@c/Form/View.vue';
import RecordErrors from '@c/database/RecordErrors.vue';
import { RecordError, RecordGet, RecordChange } from '~/lib/api/mappers';
import { ApiRequest, Params } from '~/lib/api';

type RecordGetRequest = (
  request: ApiRequest,
  id: number | string,
) => Promise<null | RecordGet<any>>;

type RecordUpdateRequest = (
  request: ApiRequest,
  id: number | string,
  params: Params,
) => Promise<null | RecordChange>;

export default Vue.extend({
  components: {
    FormView,
    RecordErrors,
  },
  props: {
    recordId: {
      type: [ Number, String ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    fields: {
      type: Array as PropType<FormField[]>,
      required: true,
    },
    getRecord: {
      type: Function as PropType<RecordGetRequest>,
      required: true,
    },
    updateRecord: {
      type: Function as PropType<RecordUpdateRequest>,
      required: true,
    },
    onSuccess: {
      type: String,
      required: true,
    },
  },
  data () {
    return {
      record: null as any,
      formValues: createFormModel(),
      loading: this.$api.createRequestState(),
      loadingFailed: false,
      updating: this.$api.createRequestState(),
      errors: null as null | RecordError[],
    };
  },
  async mounted () {
    const result = await this.$api.query(this.loading, this.getRecord, this.recordId);
    if (result?.success) {
      this.record = result.record;
      this.formValues = createFormModel(this.fields, this.record);
    } else {
      this.loadingFailed = true;
    }
  },
  methods: {
    async save () {
      if (this.updating.running) return;
      this.errors = null;
      const result = await this.$api.query(this.updating, this.updateRecord, this.recordId, this.formValues);
      if (result?.success) {
        await this.$router.push({ path: this.onSuccess });
      } else if (result?.errors) {
        this.errors = result.errors;
      } else {
        this.errors = [
          [ 'base', 'unknown fail' ],
        ];
      }
    },
  },
});
</script>
