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
import RecordName from '~/components/views/application/RecordName.vue';
import AdditionalControls from '~/components/database/records/groups/GroupGrades/AdditionalControls.vue';
import { h } from 'vue';
import SubjectColumnHeader from '~/components/database/records/groups/GroupGrades/SubjectColumnHeader.vue';
import SubjectColumnField from '~/components/database/records/groups/GroupGrades/SubjectColumnField.vue';

interface GradedSubject {
  subject: course.CourseSubject;
  grading: course.grading.GradingDefinition;
}

function parseStudent (value) {
  return wai.object2(value, value => ({
    header: wai.property(value, 'header', student.parseHeader),
  }));
}

type Student = ReturnType<typeof parseStudent>;

@Component({
  components: {
    SubjectColumnField,
    AdditionalControls,
    RecordName,
    HeaderCell,
    RecordsTable,
  },
})
export default class GroupGrades extends Vue {
  @Prop({ required: true }) readonly group!: group.Group;
  @Prop({ required: true }) readonly courseLoader!: RecordLoader<course.Course>;

  loaded = app.db.loaded(false);
  course = app.nullable<course.Course>();
  storedGrades = app.nullable<any>();
  gradeChanges = app.nullable<any>();

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

  controls = controls.Group.new('subjects');

  async mounted () {
    await Promise.resolve();

    await this.courseLoader.loadOnce();
    this.course = this.courseLoader.state.record ?? null;

    this.controls.updateField({
      ...this.controls.getField('subjects')!,
      options: (this.course?.subjects ?? [])
        .map(item => Object.freeze({ value: item.subject.id, item })),
    });
    this.controls.update('subjects', this.controls.getField('subjects')?.options);

    const response = await this.$api2.transientRequest(
      this.$api2.getQuery('groups', 'get_grades')({ id: this.group.id }),
    );
    if (response.ok) this.storedGrades = response.payload.subjects ?? {};

    if (!this.course || !this.storedGrades) {
      this.loaded = app.db.loaded(false, 'app.processing.failed_to_load');
    } else {
      this.loaded = app.db.loaded(true);
      await this.onStudentsLoad();
    }
  }

  get selectedSubjects () {
    return app
      .selectedOptionItems<course.CourseSubject>(this.controls.getValue('subjects'))
      .map(subject => ({
        subject, grading: course.grading.buildGradingDefinition(subject.grading),
      }))
      .filter((subject): subject is GradedSubject => !!subject.grading);
  }

  get columns () {
    return DataTable.flattenColumns(
      {
        name: 'person',
        size: 250,
        headerText: 'database.records.groups.GroupGrades.column.person',
      },
      ...(this.selectedSubjects.map(({ subject }) => ({
        name: `subject_${subject.subject.id}`,
        size: 150,
        header: () => h(SubjectColumnHeader, {
          props: { subject: subject.subject },
        }),
      }))),
    );
  }

  async onStudentsLoad () {
    await this.students.load(
      this.$api2,
      `/groups/${this.group.id}/students`,
      parseStudent,
    );
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
      <AdditionalControls
        :controls="controls"
        :parent-loaded="loaded"
      />
    </template>
    <template #row="{ record }">
      <td>
        <HeaderCell
          :record="record"
          :path="`/database/people/${record.id}`"
          :name="record.header.name_local"
        />
      </td>
      <td
        v-for="({subject, grading}) in selectedSubjects"
        :key="subject.subject.id"
      >
        <SubjectColumnField
          :grading="grading"
          :original-value="storedGrades?.[subject.subject.id]?.[record.id]"
          :value="gradeChanges?.[subject.subject.id]?.[record.id]"
        />
      </td>
    </template>
  </RecordsTable>
</template>
