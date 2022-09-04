<template>
  <div>
    <div class="position-relative">
      <div class="position-absolute w-100" style="z-index: 1;">
        <b-progress
          v-if="requestState.running"
          height="2px"
          :value="100"
          variant="info"
          striped
          animated
        />
      </div>
    </div>
    <b-alert v-if="requestState.fail" show variant="warning">
      <b-icon icon="exclamation-triangle-fill" class="mr-3" />
      <t value="app.record_not_found" />
    </b-alert>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { RequestState } from '~/lib/api';

@Component
export default class LoaderStrip extends Vue {
  @Prop({ required: true }) readonly requestState!: RequestState;
}
</script>
