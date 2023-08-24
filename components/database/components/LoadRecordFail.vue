<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { RequestState, SearchRecordsResponsePayload } from '~/lib/api2';

@Component
export default class LoadRecordFail extends Vue {
  @Prop({ required: true }) readonly query!: RequestState<SearchRecordsResponsePayload>;

  get isServerFail (): boolean {
    const { response } = this.query;
    return !!(response && !response.ok);
  }

  get isNotFound (): boolean {
    const { response } = this.query;
    return !!(response && response.ok && !response.payload.records[0]);
  }
}
</script>

<template>
  <div :class="[ $attrs.class, { 'd-none': !isServerFail && !isNotFound } ]">
    <b-alert
      v-if="isServerFail"
      class="mb-0"
      show
      variant="danger"
    >
      <b-icon icon="exclamation-triangle-fill" class="mr-3" />
      <t :value="`app.processing.${query.response.message}`" />
    </b-alert>
    <b-alert
      v-if="isNotFound"
      class="mb-0"
      show
      variant="warning"
    >
      <b-icon icon="exclamation-triangle-fill" class="mr-3" />
      <t value="app.processing.not_found" />
    </b-alert>
  </div>
</template>
