<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import SaveButton from '~/components/toolkit/SaveButton.vue';

export enum ActionState {
  idle = 'idle',
  processing = 'processing',
  success = 'success',
  fail = 'fail'
}

@Component({
  components: { SaveButton },
})
export default class ConfirmModal extends Vue {
  @Prop({ required: true }) readonly value!: boolean;
  @Prop({ required: true }) readonly state!: ActionState;
  @Prop() readonly failMessage?: string;

  get isOkDisabled () {
    return this.state === ActionState.fail;
  }

  get isBusy () {
    return this.state === ActionState.processing || this.state === ActionState.success;
  }

  get isProcessing () {
    return this.state === ActionState.processing;
  }
}
</script>

<template>
  <b-modal
    :visible="value"
    hide-header
    :busy="isBusy"
    :ok-disabled="isOkDisabled"
    :no-close-on-backdrop="isBusy"
    :no-close-on-esc="isBusy"
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
      <div class="alert alert-light d-flex align-items-center">
        <b-icon icon="x-octagon-fill" font-scale="2" />
        <t class="ml-2" :value="failMessage ?? 'db.modals.ConfirmActionModal.failed'" />
      </div>
    </div>
    <div v-else class="my-3">
      <slot />
    </div>
    <template #modal-footer="{ close }">
      <div class="flex-fill">
        <slot v-if="$slots.button" name="button">
          <SaveButton
            :active="!isOkDisabled && !isBusy"
            :processing="isProcessing"
            @click="$emit('confirm')"
          />
        </slot>
        <SaveButton
          variant="dark"
          text="lexicon.to_archive"
          :active="!isOkDisabled && !isBusy"
          :processing="isProcessing"
          @click="$emit('confirm')"
        />
        <b-button
          variant="outline-secondary"
          :disabled="isProcessing"
          @click="close"
        >
          <t value="app.action.cancel" />
        </b-button>
      </div>
      <div
        v-if="$slots.errors"
        class="mt-3 flex-fill"
      >
        <slot name="errors" />
      </div>
    </template>
  </b-modal>
</template>
