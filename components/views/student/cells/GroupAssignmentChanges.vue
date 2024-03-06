<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { student } from '~/lib/records';
import RecordNamedValue from '~/components/views/application/RecordNamedValue.vue';
import PrintDate from '~/components/toolkit/PrintDate.vue';
import { isSameDay } from 'date-fns';
import app from '~/lib/app';

type Changes = ReturnType<typeof student.parseAssignmentChanges>;

@Component({
  components: {
    PrintDate,
    RecordNamedValue,
  },
})
export default class GroupAssignmentChanges extends Vue {
  @Prop() changes!: app.Maybe<Changes>;

  showAddedLast (changes: Changes) {
    const { added_last, added_first } = changes;
    return added_first ? (added_last && !isSameDay(added_first, added_last)) : !!added_last;
  }
}
</script>

<template>
  <div>
    <RecordNamedValue
      v-if="changes?.added_first"
      class="mt-1"
    >
      <template #label>
        <t value="student.cells.GroupAssignmentChanges.added_later_first" />
      </template>
      <PrintDate :value="changes.added_first" />
    </RecordNamedValue>
    <RecordNamedValue
      v-if="changes?.added_last && showAddedLast(changes)"
      class="mt-1"
    >
      <template #label>
        <t value="student.cells.GroupAssignmentChanges.added_later_last" />
      </template>
      <PrintDate :value="changes.added_last" />
    </RecordNamedValue>
    <RecordNamedValue
      v-if="changes?.removed"
      class="mt-1"
    >
      <template #label>
        <t value="student.cells.GroupAssignmentChanges.removed_on" />
      </template>
      <PrintDate :value="changes.removed" />
    </RecordNamedValue>
  </div>
</template>
