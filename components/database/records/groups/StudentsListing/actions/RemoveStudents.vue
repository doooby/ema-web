<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { group } from '~/lib/records';
import ConfirmModal, { ActionState } from '~/components/database/modals/ConfirmActionModal.vue';
import { SearchRecordsResponsePayload } from '~/lib/api2';
import { difference } from 'lodash';

@Component({
  components: { ConfirmModal },
})
export default class RemoveStudents extends Vue {
  @Prop({ required: true }) readonly group!: group.Group;
  @Prop({ required: true }) readonly ids!: string[];

  modalShown = false;
  modalState = ActionState.idle;
  query = this.$api2.newQueryState<SearchRecordsResponsePayload>();

  async onSubmit () {
    this.modalState = ActionState.processing;

    await this.$api2.request(
      this.query,
      this.$api2.getQuery('groups', 'change_students')({
        id: this.group.id,
        students_ids: difference(this.group.students?.map(r => r.id), this.ids),
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
      <b-icon icon="back" class="font-12 mr-2" />
      <t value="db.record.groups.students.actions.RemoveStudents.button" />
    </div>
    <confirm-modal
      v-model="modalShown"
      :state="modalState"
      @confirm="onSubmit"
    >
      <t value="db.record.groups.students.actions.RemoveStudents.confirm" />
    </confirm-modal>
  </b-dropdown-item>
</template>
