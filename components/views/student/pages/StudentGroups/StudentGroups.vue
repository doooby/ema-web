<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import { group, person, student } from '~/lib/records';
import app from '~/lib/app';
import { wai } from '~/vendor/wai';
import { DataTable } from '~/components/toolkit/DataTable';
import RecordsTable from '~/components/views/application/RecordsTable/RecordsTable.vue';
import HeaderCell from '~/components/views/application/pages/index/HeaderCell.vue';
import RecordAssociations from '~/components/database/components/listing/RecordAssociations.vue';
import PrintDateRange from '~/components/toolkit/PrintDateRange.vue';
import RecordNamedValue from '~/components/views/application/RecordNamedValue.vue';
import RecordId from '~/components/views/application/RecordId.vue';
import PrintDate from '~/components/toolkit/PrintDate.vue';
import PrintAttendance from '~/components/views/student/pages/StudentGroups/PrintAttendance.vue';
import MiniToggle from '~/components/views/application/buttons/MiniToggle.vue';
import GroupAttendance from '~/components/views/student/cells/GroupAttendance.vue';
import GroupAssignmentChanges from '~/components/views/student/cells/GroupAssignmentChanges.vue';

function parseRecord (value) {
  return wai.object2(
    value,
    value => ({
      detail: wai.property(value, 'detail', group.parseDetail),
      school_course: wai.property(value, 'school_course', group.parseSchoolCourseSlice),
      parent: wai.property(value, 'parent', wai.nullable(wai.aResource)),
      linked_groups: wai.property(value, 'linked_groups', wai.nullable(wai.listOf(wai.aResource))),
      assignment_changes: wai.property(value, 'assignment_changes', wai.nullable(student.parseAssignmentChanges)),
      attendance: wai.property(value, 'attendance', wai.nullable(student.parseAttendance)),
    }),
  );
}

type Record = ReturnType<typeof parseRecord>;

@Component({
  components: { GroupAssignmentChanges, GroupAttendance, MiniToggle, PrintAttendance, PrintDate, RecordId, RecordNamedValue, PrintDateRange, RecordAssociations, HeaderCell, RecordsTable },
})
export default class StudentGroups extends Vue {
  @Prop({ required: true }) readonly person!: person.Person;

  groups = app.db.useResource<wai.RecordsList<wai.AResource<Record>>>();

  mounted () {
    this.groups.queryParams.staticParams = {
      slices: [ 'detail', 'school_course' ],
    };
    this.groups.queryParams.params = {
      show_history: false,
    };
  }

  get columns () {
    return DataTable.flattenColumns(
      DataTable.fixedColumn('row', 36),
      {
        name: 'group',
        size: 250,
        headerText: 'db.record.groups.meta.s',
      },
      {
        name: 'course',
        size: 200,
        headerText: 'db.record.courses.meta.s',
      },
      {
        name: 'term',
        size: 200,
        headerText: 'student.pages.StudentsGroupsListing.column.term',
      },
      {
        name: 'assignment_changes',
        size: 150,
        headerText: 'student.pages.StudentsGroupsListing.column.assignment_changes',
      },
      {
        name: 'attendance',
        size: 300,
        headerText: 'student.pages.StudentsGroupsListing.column.attendance',
      },
    );
  }

  @Watch('person')
  onLoadPage () {
    app.db.loadResource(
      this,
      this.groups,
      () => ({
        path: `/students/${this.person.id}/groups`,
        reducer: value => wai.recordsList(value, parseRecord),
      }));
  }
}
</script>

<template>
  <RecordsTable
    :resource="groups"
    :columns="columns"
    :sort-options="{ name: 'groups', options: [ 'id' ] }"
    @change="onLoadPage"
  >
    <template #prepend>
      <div class="mb-2">
        <MiniToggle
          :value="!!groups.queryParams.params?.show_history"
          text="views.student.pages.StudentGroups.show_history"
          @click="groups.queryParams.setParams({ show_history: $event })"
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
          :path="`/database/groups/${record.id}`"
          :name="record.detail.name"
        />
      </td>
      <td>
        <RecordAssociations
          :record="record.school_course"
          :associations="[
            { entity: 'courses', attr: 'course' },
            { entity: 'schools', attr: 'school' },
          ]"
        />
        <RecordNamedValue
          v-if="record.parent"
          class="font-12 mt-1"
        >
          <template #label>
            <t value="db.groups.label.parent_group" />
          </template>
          <RecordId
            class="font-14"
            :record="record.parent"
            :path="`/database/groups/${record.parent.id}`"
          />
        </RecordNamedValue>
      </td>
      <td>
        <div>
          <div>
            <t value="db.groups.caption.term" />
            <span>: </span>
            {{ record.detail.term }}
          </div>
          <PrintDateRange
            v-if="record.detail.term_dates"
            :dates="record.detail.term_dates"
          />
          <RecordNamedValue
            v-if="record.school_course.school_year"
            class="font-12 mt-1"
          >
            <template #label>
              <t value="db.school_years.singular" />
            </template>
            <RecordId
              class="font-14"
              :record="record.school_course.school_year"
            />
          </RecordNamedValue>
        </div>
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
