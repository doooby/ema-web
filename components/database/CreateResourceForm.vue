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
    <b-list-group
      v-if="errors"
      class="mt-3"
    >
      <b-list-group-item
        v-for="([attribute, message], index) in errors"
        :key="index"
        variant="danger"
      >
        <strong>{{ attribute }}</strong>: {{ message }}
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { createFormModel, FormField } from '@c/Form';
import FormView from '@c/Form/View.vue';
import { RecordErrors, ResourceChange } from '~/lib/api/mappers';
import { ApiRequest, Params } from '~/lib/api';

type ResourceCreateRequest = (request: ApiRequest, params: Params) => Promise<null | ResourceChange>;

export default Vue.extend({
  components: {
    FormView,
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
    apiRequest: {
      type: Function as PropType<ResourceCreateRequest>,
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
      errors: null as null | RecordErrors,
    };
  },
  methods: {
    save () {
      if (this.creating.running) return;
      this.errors = null;
      this.$api.query(this.creating, async () => {
        const result = await this.apiRequest(this.creating, this.formValues);
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
