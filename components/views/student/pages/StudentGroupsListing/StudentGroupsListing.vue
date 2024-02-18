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

@Component({
  components: { PrintDateRange, RecordAssociations, HeaderCell, RecordsTable },
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
        headerText: 'db.record.groups.label.term',
      },
      {
        name: 'attendance',
        size: 200,
        headerText: 'db.record.groups.label.attendance',
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
        </td>
        <td>
          <div>
            <div>
              <t value="db.record.groups.caption.term" />
              <span>: </span>
              {{ record.detail.term }}
            </div>
            <PrintDateRange
              v-if="record.detail.term_dates"
              :dates="record.detail.term_dates"
            />
          </div>
        </td>
      </template>
    </RecordsTable>
  </div>
</template>
