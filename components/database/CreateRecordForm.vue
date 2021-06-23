<template>
  <div :class="$attrs.class">
    <h2>
      {{ title }}
    </h2>
    <form-view
      v-model="formValues"
      :fields="form.fields"
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

type RecordCreateRequest = (
  request: ApiRequest,
  params: Params,
) => Promise<null | RecordChange>;

export interface FormProps {
  fields: FormField[];
  requestCreate: RecordCreateRequest;
}

export default Vue.extend({
  components: {
    FormView,
    RecordErrors,
  },
  props: {
    form: {
      type: Object as PropType<Readonly<FormProps>>,
      required: true,
    },
    title: {
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
    form () { this.reset(); },
  },
  methods: {
    async save () {
      if (this.creating.running) return;
      const { requestCreate } = this.form;
      this.errors = null;
      const result = await this.$api.query(this.creating, requestCreate, this.formValues);
      if (result?.success) {
        this.$emit('created');
      } else if (result?.errors) {
        this.errors = result.errors;
      } else {
        this.errors = [
          [ 'base', 'unknown fail' ],
        ];
      }
    },
    reset () {
      this.formValues = createFormModel();
      this.creating = this.$api.createRequestState();
      this.errors = null;
    },
  },
});
</script>
