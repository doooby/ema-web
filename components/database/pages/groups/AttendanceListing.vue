<template>
  <div>
    <div class="emy-2 d-flex">
      <text-control
        v-model="studentNameFilter"
        class="ew-14"
        :placeholder="$t('db.shared.filter')"
        size="sm"
      />
      <b-form-datepicker
        :value="date"
        class="eml-4 ew-14"
        size="sm"
        label-no-date-selected=""
        :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
        @input="onDateChange"
      />
    </div>
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
import { startOfWeek, endOfWeek, parseISO, formatISO } from 'date-fns';
import { Group, Student } from '~/lib/records';
import { defineTableColumns, TableColumn, View as DataTableView } from '~/components/DataTable';
import { AssociatedRecord, AssociatedRecordsIndex } from '~/lib/api/mappers';
import { Attendance } from '~/lib/api/attendances';
import TextControl from '~/components/database/controls/TextControl.vue';
import { BFormDatepicker } from 'bootstrap-vue';

export default Vue.extend({
  components: { DataTableView, TextControl, BFormDatepicker },
  props: {
    group: { type: Object as PropType<Group>, required: true },
  },
  data () {
    return {
      date: parseISO('2020-09-06'),
      students: {} as AssociatedRecordsIndex,
      studentNameFilter: '',
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
      const students = Object.values(this.students) as AssociatedRecord[];
      const filter = this.studentNameFilter.toLowerCase();
      if (!filter) return students;
      return students.filter(student => student.label.toLowerCase().includes(filter));
    },
  },
  watch: {
    date () {
      this.fetchRecords();
    },
  },
  mounted () {
    this.fetchRecords();
  },
  methods: {
    onDateChange (newDate) {
      this.date = parseISO(newDate);
    },
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
      if (result !== null) {
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
