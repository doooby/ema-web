<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

export enum ActionState {
  idle = 'idle',
  processing = 'processing',
  success = 'success',
  fail = 'fail'
}

@Component
export default class ConfirmModal extends Vue {
  @Prop({ required: true }) readonly value!: boolean;
  @Prop({ required: true }) readonly state!: ActionState;

  get isBusy () {
    return this.state === ActionState.processing || this.state === ActionState.success;
  }

  get isOkDisabled () {
    return this.state === ActionState.fail;
  }
}
</script>

<template>
  <b-modal
    :visible="value"
    centered
    hide-header
    :busy="isBusy"
    :ok-disabled="isOkDisabled"
    :no-close-on-backdrop="isBusy"
    :no-close-on-esc="isBusy"
    @ok.prevent="$emit('confirm')"
    @hidden="$emit('input', false)"
  >
    <div v-if="state === 'processing'" class="m-3 d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="sr-only" />
      </div>
    </div>
    <div v-else-if="state === 'success'" class="m-3 d-flex justify-content-center">
      <b-icon icon="check2-circle" variant="success" font-scale="3" />
    </div>
    <div v-else-if="state === 'fail'" class="my-3">
      <div class="alert alert-danger d-flex align-items-center">
        <b-icon icon="x-octagon-fill" font-scale="2" />
        <t class="ml-2" value="db.modals.ConfirmActionModal.failed" />
      </div>
    </div>
    <div v-else class="my-3">
      <slot />
    </div>
  </b-modal>
</template>
