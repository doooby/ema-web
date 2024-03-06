<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { wai } from '~/vendor/wai';
import { group, student } from '~/lib/records';
import app from '~/lib/app';
import { DataTable } from '~/components/toolkit/DataTable';
import RecordsTable from '~/components/views/application/RecordsTable/RecordsTable.vue';
import MiniToggle from '~/components/views/application/buttons/MiniToggle.vue';
import HeaderCell from '~/components/views/application/pages/index/HeaderCell.vue';
import PrintDate from '~/components/toolkit/PrintDate.vue';
import RecordNamedValue from '~/components/views/application/RecordNamedValue.vue';
import PrintAttendance from '~/components/views/student/pages/StudentGroups/PrintAttendance.vue';
import RecordLabels from '~/components/views/application/RecordLabels.vue';
import GroupAttendance from '~/components/views/student/cells/GroupAttendance.vue';
import GroupAssignmentChanges from '~/components/views/student/cells/GroupAssignmentChanges.vue';
import RecordsTableGroupActions from '~/components/views/application/RecordsTable/RecordsTableGroupActions.vue';
import RecordsTableRowSelect from '~/components/views/application/RecordsTable/RecordsTableRowSelect.vue';
import MoveStudents from '~/components/database/records/groups/students/actions/MoveStudents.vue';
import RemoveStudents from '~/components/database/records/groups/students/actions/RemoveStudents.vue';

function parseStudent (value) {
  return wai.object2(value, value => ({
    header: wai.property(value, 'header', student.parseHeader),
    assignment_changes: wai.property(value, 'assignment_changes', wai.nullable(student.parseAssignmentChanges)),
    attendance: wai.property(value, 'attendance', wai.nullable(student.parseAttendance)),
  }));
}

type Student = ReturnType<typeof parseStudent>;

@Component({
  components: { RemoveStudents, MoveStudents, RecordsTableRowSelect, RecordsTableGroupActions, GroupAssignmentChanges, GroupAttendance, RecordLabels, PrintAttendance, RecordNamedValue, PrintDate, HeaderCell, MiniToggle, RecordsTable },
})
export default class GroupStudents extends Vue {
  @Prop({ required: true }) readonly group!: group.Group;

  admission = new app.internals.Admission(this);

  students = new app.db.Records<Student>({
    params: {
      staticParams: {
        slices: [ 'header' ],
      },
      listingParams: {
        page: 1,
        per_page: 100,
        order_by: [ [ 'first_name_lo', 'ASC' ] ],
      },
      params: {
        show_history: false,
      },
    },
  });

  groupActions = new RecordsTableGroupActions.State();

  options = new app.internals.Options();

  get columns () {
    return DataTable.flattenColumns(
      DataTable.fixedColumn('row', 36),
      {
        name: 'person',
        size: 250,
        headerText: 'group.pages.GroupStudents.column.person',
      },
      {
        name: 'details',
        size: 200,
        headerText: 'group.pages.GroupStudents.column.details',
      },
      {
        name: 'assignment_changes',
        size: 150,
        headerText: 'group.pages.GroupStudents.column.assignment_changes',
      },
      {
        name: 'attendance',
        size: 300,
        headerText: 'group.pages.GroupStudents.column.attendance',
      },
    );
  }

  get componentContext () {
    return this;
  }

  @Watch('group')
  async onLoadPage () {
    await this.students.load(
      this.$api2,
      `/groups/${this.group.id}/students`,
      parseStudent,
    );
  }

  recordLabels (record: Student) {
    return [
      record.assignment_changes?.removed ? { variant: 'warning', text: 'student.groups.label.is_removed' } : undefined,
    ];
  }
}
</script>

<template>
  <RecordsTable
    :resource="students"
    :columns="columns"
    :sort-options="{ name: 'students', options: [ 'id', 'first_name_lo' ] }"
    :load-on-mount="true"
    :hide-per-page="true"
    @change="onLoadPage"
  >
    <template #prepend>
      <div class="mb-2">
        <MiniToggle
          :value="!!students.params?.show_history"
          text="group.pages.GroupStudents.show_history"
          @click="students.setParams({ show_history: $event })"
        />
      </div>
      <RecordsTableGroupActions
        v-if="!group.parent"
        v-slot="{ selected }"
        class="mb-2"
        :state="groupActions"
        :disabled="students.isLoading"
        :records="students.okPayload?.records"
      >
        <MoveStudents
          v-if="admission.canAction('groups/actions/v2_move_students')"
          :from-group="group"
          :students="selected"
        />
        <RemoveStudents
          v-if="admission.canAction('groups/actions/v2_change_students')"
          :group="group"
          :students="selected"
          @done="students.refresh()"
        />
      </RecordsTableGroupActions>
    </template>

    <template #row="{ record, order }">

      <td class="align-top">
        <div class="text-muted m-0 font-12">
          {{ order + 1 }}.
        </div>
        <RecordsTableRowSelect
          v-if="!group.parent"
          class="mt-2 ml-1"
          :state="groupActions"
          :record="record"
          :is-loading="students.isLoading"
        />
      </td>

      <td>
        <HeaderCell
          :record="record"
          :path="`/database/people/${record.id}`"
          :name="record.header.name_local"
        />
        <RecordLabels
          class="mt-2"
          :labels="recordLabels(record)"
        />
      </td>

      <td>
        <div class="d-flex justify-content-between align-items-center">
          <span class="mr-2">
            <t
              v-if="record.header.gender"
              :value="`app.internal_lists.gender.${record.header.gender}`"
            />
          </span>
          <span v-if="record.header.born_on" class="mr-3">
            <PrintDate :value="record.header.born_on" />
          </span>
        </div>
        <RecordNamedValue v-if="record.header.external_id">
          <template #label>
            <t value="group.label.external_id" />
          </template>
          {{ record.header.external_id }}
        </RecordNamedValue>
        <with
          v-slot="{ value }"
          :value="options.getByValue(componentContext, 'residency_status', record.header.residency_status?.[0])"
        >
          <RecordNamedValue>
            <template #label>
              <t value="group.label.residency_status" />
            </template>
            <t :value="value.item" />
          </RecordNamedValue>
        </with>
      </td>

      <td>
        <GroupAssignmentChanges
          :changes="record.assignment_changes"
        />
      </td>

      <td>
        <GroupAttendance
          v-if="record.attendance"
          :attendance="record.attendance"
        />
      </td>

    </template>
  </RecordsTable>
</template>
