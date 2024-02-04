<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import ConfirmActionModal, { ActionState } from '~/components/database/modals/ConfirmActionModal.vue';
import { wai } from '~/vendor/wai';
import app from '~/lib/app';
import { ResourceError } from '~/vendor/wai/mappers';
import RecordErrors from '~/components/database/RecordErrors.vue';

@Component({
  components: { RecordErrors, ConfirmActionModal },
})
export default class ArchiveRecord extends Vue {
  @Prop() readonly value!: boolean;
  @Prop() readonly entity!: string;
  @Prop() readonly recordId!: string;

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
    fail-message="application.modals.ArchiveRecord.failed"
    @input="$emit('input', $event)"
    @confirm="onSubmit"
  >
    <div v-if="value">
      <div class="alert alert-warning" role="alert">
        <t value="application.modals.ArchiveRecord.confirm" />
      </div>
    </div>
    <template v-if="archiveErrors.ref" #errors>
      <RecordErrors :entity="entity" :errors="archiveErrors.ref" />
    </template>
  </ConfirmActionModal>
</template>
