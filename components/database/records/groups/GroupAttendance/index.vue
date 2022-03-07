<template>
  <div>
    <a :href="urlGenerateMonth" target="_blank">Generate a month sheet</a>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Group } from '~/lib/records';

@Component
export default class GroupAttendance extends Vue {
  @Prop({ required: true }) readonly group!: Group;

  get urlGenerateMonth (): string {
    return `/server/pdf/attendance_month/${this.group.id}`;
  }
}
</script>
