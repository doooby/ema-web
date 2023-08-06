<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { group, person } from '~/lib/records';

export interface MoveStudentsParams {
  fromGroup: group.Group;
  students: person.Person[];
}

@Component
export default class MoveStudents extends Vue {
  @Prop({ required: true }) readonly fromGroup!: group.Group;
  @Prop({ required: true }) readonly students!: person.Person[];

  onClick (): void {
    this.$store.dispatch('action/goToActionPage', {
      context: this,
      newPage: '/database/people/move_students',
      data: {
        fromGroup: this.fromGroup,
        students: this.students,
      } as MoveStudentsParams,
    });
  }
}
</script>

<template>
  <b-dropdown-item @click="onClick">
    <t value="db.record.groups.students.actions.MoveStudents.button" />
  </b-dropdown-item>
</template>
