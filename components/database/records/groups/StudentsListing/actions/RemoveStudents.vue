<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { group } from '~/lib/records';
import ConfirmModal, { ActionState } from '~/components/database/modals/ConfirmActionModal.vue';

@Component({
  components: { ConfirmModal },
})
export default class RemoveStudents extends Vue {
  @Prop({ required: true }) readonly group!: group.Group;
  @Prop({ required: true }) readonly ids!: string[];

  modalShown = false;
  modalState = ActionState.idle;

  onSubmit () {
    this.modalState = ActionState.processing;
    setTimeout(() => {
      // this.modalState = ActionState.fail;
      this.modalState = ActionState.success;
      setTimeout(() => {
        this.modalShown = false;
      }, 400);
    }, 1000);
    console.log(this.ids, this.group.id);
  }

  onShow () {
    this.modalShown = true;
    this.modalState = ActionState.idle;
  }
}
</script>

<template>
  <b-dropdown-item @click="onShow">
    <t value="db.record.groups.students.actions.RemoveStudents.button" />
    <confirm-modal
      v-model="modalShown"
      :state="modalState"
      @confirm="onSubmit"
    >
      <t value="db.record.groups.students.actions.RemoveStudents.confirm" />
    </confirm-modal>
  </b-dropdown-item>
</template>
