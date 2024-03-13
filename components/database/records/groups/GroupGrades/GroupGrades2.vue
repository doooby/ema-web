<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { course, group, student } from '~/lib/records';
import { RecordLoader } from '~/lib/api2';
import controls from '~/components/controls';
import app from '~/lib/app';
import { wai } from '~/vendor/wai';
import { DataTable } from '~/components/toolkit/DataTable';
import RecordsTable from '~/components/views/application/RecordsTable/RecordsTable.vue';
import HeaderCell from '~/components/views/application/pages/index/HeaderCell.vue';

function parseStudent (value) {
  return wai.object2(value, value => ({
    header: wai.property(value, 'header', student.parseHeader),
  }));
}

type Student = ReturnType<typeof parseStudent>;

@Component({
  components: { HeaderCell, RecordsTable },
})
export default class GroupGrades extends Vue {
  @Prop({ required: true }) readonly group!: group.Group;
  @Prop({ required: true }) readonly courseLoader!: RecordLoader<course.Course>;

  loaded = app.db.loaded(false);
  courseRef = app.createRef<course.Course>();
  storedGradesRef = app.createRef<any>();

  form = controls.Group.new(
    'unknown',
  );

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
    },
  });

  async mounted () {
    await Promise.resolve();
    await this.courseLoader.loadOnce();
    this.courseRef.ref = this.courseLoader.state.record ?? undefined;
    const response = await this.$api2.transientRequest(
      this.$api2.getQuery('groups', 'get_grades')({ id: this.group.id }),
    );
    if (response.ok) this.storedGradesRef.ref = response.payload;

    if (!this.courseRef.ref || !this.storedGradesRef) {
      this.loaded = app.db.loaded(false, 'app.processing.failed_to_load');
    } else {
      this.loaded = app.db.loaded(true);
      await this.onStudentsLoad();
    }
  }

  get columns () {
    return DataTable.flattenColumns(
      {
        name: 'person',
        size: 250,
        headerText: 'database.records.groups.GroupGrades.column.person',
      },
    );
  }

  async onStudentsLoad () {
    await this.students.load(
      this.$api2,
      `/groups/${this.group.id}/students`,
      parseStudent,
    );
    // this.form.reset();
  }
}
</script>

<template>
  <RecordsTable
    :resource="students"
    :parent-loaded="loaded"
    :columns="columns"
    :sort-options="{ name: 'students', options: [ 'id', 'first_name_lo' ] }"
    :hide-per-page="true"
    @change="onStudentsLoad"
  >
    <template #prepend>
      <div class="mb-2">
        fasdfs
      </div>
    </template>
    <template #row="{ record }">
      <td>
        <HeaderCell
          :record="record"
          :path="`/database/people/${record.id}`"
          :name="record.header.name_local"
        />
      </td>
    </template>

  </RecordsTable>
</template>
