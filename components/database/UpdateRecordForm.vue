<template>
  <div :class="$attrs.class">
    <b-alert :show="!record.item && !record.failed" variant="info">
      {{ $t('db.shared.loading') }}
    </b-alert>
    <b-alert :show="record.failed" variant="warning">
      {{ $t('db.shared.record_not_found') }}
    </b-alert>
    <form-view
      v-if="record.item"
      v-model="formValues"
      :fields="form.fields"
      :model="record.item"
    />
    <div v-if="record.item" class="text-right">
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
import { createFormModel, formModelToRecordParams, FormField, View as FormView } from '~/components/Form';
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
      record: {
        item: null as any,
        request: this.$api.createRequestState(),
        failed: false,
      },
      formValues: createFormModel(),
      updating: this.$api.createRequestState(),
      errors: null as null | RecordError[],
    };
  },
  watch: {
    form () { this.reset(); },
  },
  async mounted () {
    const { id, requestGet, fields } = this.form;
    const result = await this.$api.query(this.record.request, requestGet, id);
    if (result?.success) {
      this.record.item = result.record;
      this.formValues = createFormModel(fields, this.record.item);
    } else {
      this.record.failed = true;
    }
  },
  methods: {
    async save () {
      if (this.updating.running) return;
      this.errors = null;
      const { id, requestUpdate } = this.form;
      const params = formModelToRecordParams(this.form.fields, this.formValues);
      const result = await this.$api.query(this.updating, requestUpdate, id, params);
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
      this.record = {
        item: null as any,
        request: this.$api.createRequestState(),
        failed: false,
      };
      this.formValues = createFormModel();
      this.updating = this.$api.createRequestState();
      this.errors = null;
    },
  },
});
</script>
