<template>
  <div>
    <data-table-view
      :columns="columns"
      :dataset="selectedStudents"
    >
      <template #header-cell="{ column }">
        {{ column.data ? formatISO(column.data.attendance.date) : $t(`record.students.${column.name}`) }}
      </template>
      <template #attendance="{ column, row }">
        {{ presenceText(row.item, column.data.attendance) }}
      </template>
    </data-table-view>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { startOfWeek, endOfWeek, parseISO as parseDate, formatISO } from 'date-fns';
import { Group, Student } from '~/lib/records';
import { defineTableColumns, TableColumn, View as DataTableView } from '~/components/DataTable';
import { AssociatedRecord, AssociatedRecordsIndex } from '~/lib/api/mappers';
import { Attendance } from '~/lib/api/attendances';

export default Vue.extend({
  components: { DataTableView },
  props: {
    group: { type: Object as PropType<Group>, required: true },
  },
  data () {
    return {
      date: parseDate('2020-09-06'),
      students: {} as AssociatedRecordsIndex,
      records: [] as Attendance[],
      fetching: this.$api.createRequestState(),
    };
  },
  computed: {
    columns (): Readonly<TableColumn[]> {
      return defineTableColumns([
        { name: 'id', cell: { type: 'link', entity: 'students' } },
        { name: 'full_name', getText: student => student.label },
        ...this.records.map((attendance, index) => ({
          name: `a-${index}`,
          data: { attendance },
          slot: 'attendance',
        })),
      ]);
    },
    selectedStudents (): AssociatedRecord[] {
      return Object.values(this.students) as AssociatedRecord[];
    },
  },
  mounted () {
    this.fetchRecords();
  },
  methods: {
    formatISO (date: Date): string {
      return formatISO(date, { representation: 'date' });
    },
    async fetchRecords () {
      if (this.fetching.running) return;
      const result = await this.$api.query(
        this.fetching,
        this.$api.queries.groups.getAttendances,
        this.group.id,
        startOfWeek(this.date),
        endOfWeek(this.date),
      );
      if (result?.success) {
        this.students = result.students;
        this.records = result.records;
      }
    },
    presenceText (student: Student, attendance: Attendance): string {
      const present = attendance.present_students.find(s => s.id === student.id);
      return present ? 'yep' : 'nope';
    },
  },
});
</script>
