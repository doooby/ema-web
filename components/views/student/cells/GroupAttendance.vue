<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import PrintAttendance from '~/components/views/student/pages/StudentGroups/PrintAttendance.vue';
import { student } from '~/lib/records';

@Component({
  components: { PrintAttendance },
})
export default class GroupAttendance extends Vue {
    @Prop() attendance!: ReturnType<typeof student.parseAttendance>;
}
</script>

<template>
  <div>
    <div>
      <t class="text-muted" value="student.cells.GroupAttendance.present" />
      <span class="text-muted"> :</span>
      {{ attendance.present }}
    </div>
    <PrintAttendance
      text="student.cells.GroupAttendance.must_attend"
      :present="attendance.present"
      :must="attendance.must"
      :strong="true"
    />
    <PrintAttendance
      text="student.cells.GroupAttendance.sessions"
      :present="attendance.present"
      :must="attendance.sessions"
    />
  </div>
</template>
