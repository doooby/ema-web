<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { wai } from '~/vendor/wai';
import { student } from '~/lib/records';
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

function parseRecord (value) {
  return wai.object2(value, value => ({
    header: wai.property(value, 'header', student.parseHeader),
    assignment_changes: wai.property(value, 'assignment_changes', wai.nullable(student.parseAssignmentChanges)),
    attendance: wai.property(value, 'attendance', wai.nullable(student.parseAttendance)),
  }));
}

type Record = ReturnType<typeof parseRecord>;

@Component({
  components: { GroupAssignmentChanges, GroupAttendance, RecordLabels, PrintAttendance, RecordNamedValue, PrintDate, HeaderCell, MiniToggle, RecordsTable },
})
export default class GroupStudents extends Vue {
  @Prop({ required: true }) readonly group!: wai.AResource;

  students = app.db.useResource<wai.RecordsList<wai.AResource<Record>>>(
    (params) => {
      params.staticParams = {
        slices: [ 'header' ],
      };
      params.listingParams = {
        page: 1,
        per_page: 100,
        order_by: [ [ 'first_name_lo', 'ASC' ] ],
      };
    },
  );

  options = new app.internals.Options();

  mounted () {
    this.students.queryParams.params = {
      show_history: false,
    };
  }

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
  onLoadPage () {
    app.db.loadResource(
      this,
      this.students,
      () => ({
        path: `/groups/${this.group.id}/students`,
        reducer: value => wai.recordsList(value, parseRecord),
      }));
  }

  recordLabels (record: Record) {
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
    @change="onLoadPage"
  >
    <template #prepend>
      <div class="mb-2">
        <MiniToggle
          :value="!!students.queryParams.params?.show_history"
          text="group.pages.GroupStudents.show_history"
          @click="students.queryParams.setParams({ show_history: $event })"
        />
      </div>
    </template>
    <template #row="{ record, order }">

      <td class="align-top">
        <span class="text-muted m-0 font-12">
          {{ order + 1 }}.
        </span>
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
