<template>
  <div :class="$attrs.class">
    <h2>
      {{ title }}
    </h2>
    <form-view
      v-model="formValues"
      :fields="fields"
    />
    <div class="text-right">
      <span v-if="creating.running">
        processing...
      </span>
      <b-button
        variant="success"
        :disabled="creating.running"
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
import { createFormModel, FormField, View as FormView } from '~/components/Form';
import RecordErrors from './RecordErrors.vue';
import { RecordError, RecordChange } from '~/lib/api/mappers';
import { ApiRequest, Params } from '~/lib/api';

type RecordCreateRequest = (request: ApiRequest, params: Params) => Promise<null | RecordChange>;

export default Vue.extend({
  components: {
    FormView,
    RecordErrors,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    fields: {
      type: Array as PropType<FormField[]>,
      required: true,
    },
    createRecord: {
      type: Function as PropType<RecordCreateRequest>,
      required: true,
    },
    onSuccessRoute: {
      type: String,
      required: true,
    },
  },
  data () {
    return {
      formValues: createFormModel(),
      creating: this.$api.createRequestState(),
      errors: null as null | RecordError[],
    };
  },
  watch: {
    fields () {
      this.formValues = createFormModel();
    },
    createRecord () {
      this.creating = this.$api.createRequestState();
      this.errors = null;
    },
  },
  methods: {
    async save () {
      if (this.creating.running) return;
      this.errors = null;
      const result = await this.$api.query(this.creating, this.createRecord, this.formValues);
      if (result?.success) {
        await this.$router.push({ path: this.onSuccessRoute });
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
