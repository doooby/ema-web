<template>
  <div :class="$attrs.class">
    <b-alert :show="!record && !loadingFailed" variant="info">
      {{ $t('db.shared.loading') }}
    </b-alert>
    <b-alert :show="loadingFailed" variant="warning">
      {{ $t('db.shared.record_not_found') }}
    </b-alert>
    <form-view
      v-if="record"
      v-model="formValues"
      :fields="form.fields"
    />
    <div v-if="record" class="text-right">
      <span v-if="updating.running">
        {{ $t('db.shared.processing') }}
      </span>
      <b-button
        variant="success"
        :disabled="updating.running"
        @click="save"
      >
        {{ $t('db.shared.save') }}
      </b-button>
    </div>
    <record-errors :errors="errors" />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { createFormModel, FormField, View as FormView } from '~/components/Form';
import RecordErrors from '~/components/database/RecordErrors.vue';
import { RecordError, RecordGet, RecordChange } from '~/lib/api/mappers';
import { ApiRequest, Params } from '~/lib/api';

type RecordGetRequest = (
  request: ApiRequest,
  id: number,
) => Promise<null | RecordGet<any>>;

type RecordUpdateRequest = (
  request: ApiRequest,
  id: number,
  params: Params,
) => Promise<null | RecordChange>;

export interface FormProps {
  id: number;
  fields: FormField[];
  requestGet: RecordGetRequest;
  requestUpdate: RecordUpdateRequest;
}

export default Vue.extend({
  components: { FormView, RecordErrors },
  props: {
    form: {
      type: Object as PropType<Readonly<FormProps>>,
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
  watch: {
    form () { this.reset(); },
  },
  async mounted () {
    const { id, requestGet, fields } = this.form;
    const result = await this.$api.query(this.loading, requestGet, id);
    if (result?.success) {
      this.record = result.record;
      this.formValues = createFormModel(fields, this.record);
    } else {
      this.loadingFailed = true;
    }
  },
  methods: {
    async save () {
      if (this.updating.running) return;
      const { id, requestUpdate } = this.form;
      this.errors = null;
      const result = await this.$api.query(this.updating, requestUpdate, id, this.formValues);
      if (result?.success) {
        this.$emit('updated');
      } else if (result?.errors) {
        this.errors = result.errors;
      } else {
        this.errors = [
          [ 'base', 'unknown fail' ],
        ];
      }
    },
    reset () {
      this.record = null;
      this.formValues = createFormModel();
      this.loading = this.$api.createRequestState();
      this.loadingFailed = false;
      this.updating = this.$api.createRequestState();
      this.errors = null;
    },
  },
});
</script>
