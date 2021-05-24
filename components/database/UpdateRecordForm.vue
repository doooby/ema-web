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
import { RecordError, RecordChange } from '~/lib/api/mappers';
import { ApiRequest, Params } from '~/lib/api';

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
    apiRequest: {
      type: Function as PropType<RecordUpdateRequest>,
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
      updating: this.$api.createRequestState(),
      errors: null as null | RecordError[],
    };
  },
  methods: {
    save () {
      if (this.updating.running) return;
      this.errors = null;
      this.$api.query(this.updating, async () => {
        const result = await this.apiRequest(this.updating, this.recordId, this.formValues);
        if (result?.success) {
          await this.$router.push({ path: this.onSuccessRoute });
        } else if (result?.errors) {
          this.errors = result.errors;
        } else {
          this.errors = [
            [ 'base', 'unknown fail' ],
          ];
        }
      });
    },
  },
});
</script>
