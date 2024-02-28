<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { group } from '~/lib/records';

export interface MoveStudentsParams {
  fromGroup?: {
    schoolId: string;
    courseId: string;
    groupId: string;
  };
  studentsIds: string[];
}

@Component
export default class MoveStudents extends Vue {
  @Prop({ default: undefined }) readonly fromGroup!: undefined | group.Group;
  // TODO use `wai.AResource`
  @Prop({ required: true }) readonly students!: { id?: string }[];

  onClick (): void {
    const data: MoveStudentsParams = {
      fromGroup: this.fromGroup && {
        schoolId: this.fromGroup.school.id,
        courseId: this.fromGroup.course.id,
        groupId: this.fromGroup.id,
      },
      studentsIds: this.students
        .map(person => person.id)
        .filter(self => self) as string[],
    };
    this.$store.dispatch('action/goToActionPage', {
      context: this,
      newPage: '/database/people/move_students',
      data,
    });
  }
}
</script>

<template>
  <b-dropdown-item @click="onClick">
    <t v-if="fromGroup" value="db.record.groups.students.actions.MoveStudents.button_move" />
    <t v-else value="db.record.groups.students.actions.MoveStudents.button_add" />
  </b-dropdown-item>
</template>
