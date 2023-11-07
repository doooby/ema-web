<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { group, person } from '~/lib/records';

export interface DropoutStudentsParams {
  groupId: string;
  studentsIds: string[];
}

@Component
export default class ActionDropoutStudents extends Vue {
  @Prop({ required: true }) readonly group!: group.Group;
  @Prop({ required: true }) readonly students!: person.Person[];

  onClick (): void {
    const data: DropoutStudentsParams = {
      groupId: this.group.id,
      studentsIds: this.students.map(person => person.id),
    };
    this.$store.dispatch('action/goToActionPage', {
      context: this,
      newPage: '/database/groups/dropout_students',
      data,
    });
  }
}
</script>

<template>
  <b-dropdown-item @click="onClick">
    <t value="db.record.groups.students.actions.DropoutStudents.button" />
  </b-dropdown-item>
</template>
