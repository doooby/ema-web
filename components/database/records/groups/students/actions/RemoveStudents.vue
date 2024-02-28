<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { group } from '~/lib/records';
import ConfirmModal, { ActionState } from '~/components/database/modals/ConfirmActionModal.vue';
import { SearchRecordsResponsePayload } from '~/lib/api2';
import { difference } from 'lodash';
import RequestButton from '~/components/views/application/buttons/RequestButton.vue';

@Component({
  components: { RequestButton, ConfirmModal },
})
export default class RemoveStudents extends Vue {
  @Prop({ required: true }) readonly group!: group.Group;
  // TODO use `wai.AResource`
  @Prop({ required: true }) readonly students!: { id?: string }[];

  modalShown = false;
  modalState = ActionState.idle;
  query = this.$api2.newQueryState<SearchRecordsResponsePayload>();

  async onSubmit () {
    this.modalState = ActionState.processing;

    const ids = this.students.map(({ id }) => id);
    await this.$api2.request(
      this.query,
      this.$api2.getQuery('groups', 'change_students')({
        id: this.group.id,
        students_ids: difference(this.group.students?.map(r => r.id), ids).filter(self => self),
      }),
    );

    const { response } = this.query;
    if (response?.ok) {
      this.modalState = ActionState.success;
      this.modalShown = false;
      this.$emit('done');
    } else {
      this.modalState = ActionState.fail;
    }
  }

  onShow () {
    this.modalShown = true;
    this.modalState = ActionState.idle;
  }
}
</script>

<template>
  <b-dropdown-item @click="onShow">
    <div class="d-flex align-items-center">
      <t value="db.record.groups.students.actions.RemoveStudents.button" />
    </div>
    <ConfirmModal
      v-model="modalShown"
      :state="modalState"
      @confirm="onSubmit"
    >
      <div class="alert alert-warning" role="alert">
        <t value="db.record.groups.students.actions.RemoveStudents.confirm" />
      </div>
      <template #button="{ active, processing, confirm }">
        <RequestButton
          class="btn-warning"
          text="lexicon.to_remove"
          :active="active"
          :processing="processing"
          @click="confirm"
        />
      </template>
    </ConfirmModal>
  </b-dropdown-item>
</template>
