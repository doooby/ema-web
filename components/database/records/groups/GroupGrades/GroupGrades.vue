<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { course, group, student } from '~/lib/records';
import { ErrorMessage, RecordLoader, UpdatedRecordResponsePayload } from '~/lib/api2';
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
import TransactionControls from '~/components/views/application/db/TransactionControls.vue';
import RecordErrors, { mapErrors } from '~/components/database/RecordErrors.vue';

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
    RecordErrors,
    TransactionControls,
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

  pageState: app.PageState = { isLoading: true };
  course = app.nullable<course.Course>();

  storedRecord = app.nullable<any>();
  recordChanges = app.nullable<any>();
  recordQueryState = this.$api2.newQueryState<UpdatedRecordResponsePayload>();
  recordTransaction = new app.Transaction(
    () => this.onSave(),
    () => this.onSaveCancel(),
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

  controls = controls.Group.new('subjects');

  // TODO change to created
  async mounted () {
    await Promise.resolve(); // probably because course loader

    await this.courseLoader.loadOnce();
    this.course = this.courseLoader.state.record ?? null;

    this.controls.updateField({
      ...this.controls.getField('subjects')!,
      options: (this.course?.subjects ?? [])
        .map(item => Object.freeze({ value: item.subject.id, item })),
    });
    this.controls.update('subjects', this.controls.getField('subjects')?.options);

    if (!this.course) {
      this.pageState = {
        isLoading: false,
        errorMessage: 'app.processing.failed_to_load',
      };
    } else {
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

  get childPageState (): app.PageState {
    return {
      isLoading: this.pageState.isLoading || this.recordTransaction.state.isProcessing,
      errorMessage: this.pageState.errorMessage,
    };
  }

  async onStudentsLoad () {
    this.pageState = { isLoading: true };
    this.recordChanges = null;
    this.storedRecord = null;

    await this.students.load(
      this.$api2,
      `/groups/${this.group.id}/students`,
      parseStudent,
    );

    const response = await this.$api2.transientRequest(
      this.$api2.getQuery('groups', 'get_grades')({ id: this.group.id }),
    );
    if (!response.ok) {
      this.pageState = {
        isLoading: false,
        errorMessage: 'app.processing.failed_to_load',
      };
      return;
    }
    this.storedRecord = Object.freeze(response.payload.subjects ?? {});

    this.pageState = { isLoading: false };
  }

  onChangeGrade (
    subject_id: string,
    person_id: app.Maybe<string>,
    value: string,
  ) {
    if (!subject_id || !person_id) return;
    this.recordChanges = group.grades.updateGradesRecord(
      this.recordChanges,
      this.storedRecord,
      subject_id,
      person_id,
      value,
    );
  }

  async onSave () {
    if (!this.recordChanges) return;
    this.recordTransaction.state.isProcessing = true;
    await this.$api2.request(
      this.recordQueryState,
      this.$api2.getQuery('groups', 'update_grades')({
        id: this.group.id,
        subjects: this.recordChanges,
      }),
    );
    this.recordTransaction.state.isProcessing = false;

    if (this.recordQueryState.okPayload?.record_id) {
      this.students.refresh();
    }
  }

  get saveErrors (): undefined | ErrorMessage[] {
    return mapErrors(
      this.recordQueryState.response,
      payload => payload.record_id === undefined ? payload.errors : undefined,
    );
  }

  onSaveCancel () {
    if (this.recordTransaction.state.isProcessing) return;
    this.recordChanges = null;
    this.recordQueryState.response = undefined;
  }
}
</script>

<template>
  <RecordsTable
    :resource="students"
    :page-state="childPageState"
    :columns="columns"
    :sort-options="{ name: 'students', options: [ 'id', 'first_name_lo' ] }"
    :hide-per-page="true"
    @change="onStudentsLoad"
  >
    <template #prepend>
      <AdditionalControls
        :controls="controls"
        :page-state="pageState"
      />
    </template>
    <template #prepend-records="{ columnsCount }">
      <tbody>
        <tr
          v-if="selectedSubjects?.length"
          class="ema--toolkit--data-table--tr__border_bottom ema--toolkit--data-table--tr__non_hoverable"
        >
          <td />
          <td
            v-for="({ subject, grading }) in selectedSubjects"
            :key="subject.subject.id"
          >
            <div>
              <t value="app.common.label.min" class="text-muted" />:
              {{ grading.options[1] }}
            </div>
            <div>
              <t value="app.common.label.max" class="text-muted" />:
              {{ grading.options[grading.options.length - 1] }}
            </div>
            <div v-if="grading.requiredIndex">
              <t value="app.common.label.required" class="text-muted" />:
              {{ grading.options[grading.requiredIndex] }}
            </div>
          </td>
          <td />
        </tr>
        <tr
          v-if="recordChanges"
          class="ema--toolkit--data-table--tr__border_bottom ema--toolkit--data-table--tr__non_hoverable"
        >
          <td :colspan="columnsCount">
            <TransactionControls
              :active="true"
              :transaction="recordTransaction"
            >
              <template #errors>
                <RecordErrors
                  class="m-2"
                  entity="groups"
                  :errors="saveErrors"
                />
              </template>
            </TransactionControls>
          </td>
        </tr>
      </tbody>
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
        v-for="({ subject, grading }) in selectedSubjects"
        :key="subject.subject.id"
      >
        <SubjectColumnField
          :grading="grading"
          :original-value="storedRecord?.[subject.subject.id]?.[record.id]"
          :value="recordChanges?.[subject.subject.id]?.[record.id]"
          @change="onChangeGrade(subject.subject.id, record.id, $event)"
        />
      </td>
    </template>
  </RecordsTable>
</template>
