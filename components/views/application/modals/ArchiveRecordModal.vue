<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import ConfirmActionModal, { ActionState } from '~/components/database/modals/ConfirmActionModal.vue';
import { wai } from '~/vendor/wai';
import app from '~/lib/app';
import { ResourceError } from '~/vendor/wai/mappers';
import RecordErrors from '~/components/database/RecordErrors.vue';
import RequestButton from '~/components/views/application/buttons/RequestButton.vue';

@Component({
  components: { RequestButton, RecordErrors, ConfirmActionModal },
})
export default class ArchiveRecordModal extends Vue {
  @Prop({ required: true }) readonly value!: boolean;
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ required: true }) readonly recordId!: string;

  actionState = ActionState.idle;

  archiveErrors = app.createRef<ResourceError[]>();

  @Watch('value')
  onValueChange () {
    this.actionState = ActionState.idle;
    this.archiveErrors.ref = undefined;
  }

  async onSubmit () {
    this.actionState = ActionState.processing;
    const { response } = await this.$api2.V3_request({
      path: `/${this.entity}/${this.recordId}/archive`,
      reducer: wai.recordUpdate,
    });

    this.archiveErrors.ref = app.api.updateErrors(response);
    if (!this.archiveErrors.ref) {
      this.actionState = ActionState.success;
      setTimeout(
        () => this.$emit('archived'),
        1000,
      );
    } else {
      this.actionState = ActionState.fail;
    }
  }
}
</script>

<template>
  <ConfirmActionModal
    :value="value"
    :state="actionState"
    fail-message="application.modals.ArchiveRecordModal.failed"
    @input="$emit('input', $event)"
    @confirm="onSubmit"
  >
    <div v-if="value">
      <div class="alert alert-warning" role="alert">
        <t value="application.modals.ArchiveRecordModal.confirm" />
      </div>
    </div>
    <template #button="{ active, processing, confirm }">
      <RequestButton
        class="btn-dark"
        text="lexicon.to_archive"
        :active="active"
        :processing="processing"
        @click="confirm"
      />
    </template>
    <template v-if="archiveErrors.ref" #errors>
      <RecordErrors :entity="entity" :errors="archiveErrors.ref" />
    </template>
  </ConfirmActionModal>
</template>
