<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import { group, person } from '~/lib/records';
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

@Component({
  components: { PrintDate, RecordId, RecordNamedValue, PrintDateRange, RecordAssociations, HeaderCell, RecordsTable },
})
export default class StudentGroupsListing extends Vue {
  @Prop({ required: true }) readonly person!: person.Person;

  filters = app.db.useFilters('id');
  groups = app.db.useResource<wai.RecordsList<wai.AResource<{
    detail: group.DetailSlice;
    school_course: group.SchoolCourseSlice;
  }>>>();

  mounted () {
    this.groups.queryParams.staticParams = {
      slices: [ 'detail', 'school_course' ],
    };
    this.onLoadPage();
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
        size: 140,
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
  @Watch('filters')
  onLoadPage () {
    app.db.loadResource(
      this,
      this.groups,
      () => ({
        path: `/students/${this.person.id}/groups`,
        reducer: value => wai.recordsList(value, wai.object(
          value => ({
            detail: wai.property(value, 'detail', value => group.parseDetail(value)),
            school_course: wai.property(value, 'school_course', value => group.parseSchoolCourseSlice(value)),
            parent: wai.property(value, 'parent', wai.nullable(wai.aResource)),
            linked_groups: wai.property(value, 'linked_groups', wai.nullable(wai.listOf(wai.aResource))),
            assignment_changes: wai.property(value, 'assignment_changes', wai.nullable(wai.object(value => ({
              added: wai.property(value, 'added', wai.nullable(wai.time)),
              removed: wai.property(value, 'removed', wai.nullable(wai.time)),
            })))),
            attendance: wai.property(value, 'attendance', wai.nullable(wai.object(value => ({
              present: wai.property(value, 'present', wai.integer),
              must: wai.property(value, 'must', wai.integer),
              sessions: wai.property(value, 'sessions', wai.integer),
            })))),
          }),
        )),
      }));
  }
}
</script>

<template>
  <div>
    <span>controls</span>
    <RecordsTable
      :resource="groups"
      :columns="columns"
    >
      <template #row="{ record, order }">
        <td class="align-top">
          <span class="text-muted m-0 font-12">
            {{ order }}.
          </span>
        </td>
        <HeaderCell
          :record="record"
          :path="`/database/groups/${record.id}`"
          :name="record.detail.name"
        />
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
          <RecordNamedValue
            v-if="record.assignment_changes?.added"
            class="mt-1"
          >
            <template #label>
              <t class="font-12" value="student.pages.StudentsGroupsListing.label.added_later" />
            </template>
            <PrintDate :value="record.assignment_changes.added" />
          </RecordNamedValue>
          <RecordNamedValue
            v-if="record.assignment_changes?.removed"
            class="mt-1"
          >
            <template #label>
              <t class="font-12" value="student.pages.StudentsGroupsListing.label.removed" />
            </template>
            <PrintDate :value="record.assignment_changes.removed" />
          </RecordNamedValue>

        </td>
        <td>
          <div v-if="record.attendance">
            <div>
              <t value="student.pages.StudentsGroupsListing.attendance.present" />
              <span>: {{ record.attendance.present }}</span>
            </div>
            <div>
              <t value="student.pages.StudentsGroupsListing.attendance.must_attend" />
              <span>: </span>
              {{ record.attendance.must }}
              <span> | </span>
              <strong>{{ ((record.attendance.present / record.attendance.must) * 100).toFixed(2) }}&nbsp;%</strong>
            </div>
            <div>
              <t value="student.pages.StudentsGroupsListing.attendance.sessions" />
              <span>: </span>
              <span>{{ record.attendance.sessions }} </span>
              <span> | </span>
              <span>{{ ((record.attendance.present / record.attendance.sessions) * 100).toFixed(2) }}&nbsp;%</span>
            </div>
          </div>
        </td>
      </template>
    </RecordsTable>
  </div>
</template>
