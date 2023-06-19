<template>
  <div>
    <div class="position-relative">
      <div class="position-absolute w-100" style="z-index: 1;">
        <b-progress
          v-if="!requestState.response"
          height="2px"
          :value="100"
          variant="info"
          striped
          animated
        />
      </div>
    </div>
    <b-alert v-if="failedResponse" show variant="warning">
      <b-icon icon="exclamation-triangle-fill" class="mr-3" />
      <t :value="`app.${failedResponse.message ?? 'request_fail'}`" />
    </b-alert>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { RequestState } from '~/lib/api2';

@Component
export default class LoaderStrip extends Vue {
  @Prop({ required: true }) readonly requestState!: RequestState<unknown>;

  get failedResponse () {
    if (this.requestState.response && !this.requestState.response.ok) {
      return this.requestState.response;
    }
  }
}
</script>
