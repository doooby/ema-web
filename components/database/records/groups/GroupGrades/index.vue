<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { application_record, course, group } from '~/lib/records';
import { BRecord, ErrorMessage, RecordLoader, UpdatedRecordResponsePayload } from '~/lib/api2';
import ARecordsListing from '~/components/database/components/listing/ARecordsListing/ARecordsListing.vue';
import PrintFullName from '~/components/database/records/people/PrintFullName.vue';
import ARecordLink from '~/components/database/components/ARecordLink.vue';
import SubjectColumnHeader from '~/components/database/records/groups/GroupGrades/SubjectColumnHeader.vue';
import { h } from 'vue';
import SubjectColumnField from '~/components/database/records/groups/GroupGrades/SubjectColumnField.vue';
import { Column } from '~/components/DataTable/v3';
import RecordErrors, { mapErrors } from '~/components/database/RecordErrors.vue';

export interface SubjectColumn {
  subject: BRecord;
  grading: course.grading.GradingDefinition;
  column: Column;
}

@Component({
  components: { RecordErrors, ARecordLink, PrintFullName, ARecordsListing, SubjectColumnField },
})
export default class GroupGrades extends Vue {
  @Prop({ required: true }) readonly group!: group.Group;
  @Prop({ required: true }) readonly courseLoader!: RecordLoader<course.Course>;

  getGrades = this.$api2.newQueryState<any>();
  updateGrades = this.$api2.newQueryState<UpdatedRecordResponsePayload>();
  gradeChanges: any = null;
  reloading = false;

  get listingParams () {
    return { group_id: this.group.id };
  }

  get SubjectColumns (): SubjectColumn[] {
    if (!this.courseLoader.state.record) return [];
    const list: (undefined | SubjectColumn)[] = course.grading.buildSubjectsGrading(
      this.courseLoader.state.record,
    ).map(
      ({ grading, subject }) => {
        if (!grading) return undefined;

        return {
          subject,
          grading,
          column: {
            name: `column_${subject.id}`,
            size: 120,
            renderHeader: () => h(SubjectColumnHeader, {
              props: { subject },
            }),
          },
        };
      });
    return list.filter(a => a) as SubjectColumn[];
  }

  get columns () {
    return [
      ...application_record.fillDataTableColumns('people', [
        { name: 'person', size: 200 },
      ]),
      ...this.SubjectColumns.map(({ column }) => column),
    ];
  }

  async mounted () {
    await Promise.resolve();

    if (!this.courseLoader.state.response) {
      await this.courseLoader.load();
    }

    if (!this.courseLoader.state.record) return;

    await this.$api2.request(
      this.getGrades,
      this.$api2.getQuery('groups', 'get_grades')({ id: this.group.id }),
    );
  };

  get isLoading () {
    return this.courseLoader.state.loading || this.getGrades.processing;
  }

  get isDataPresent () {
    return !!(this.courseLoader.state.record && this.getGrades.response?.ok);
  }

  get grades () {
    const { response } = this.getGrades;
    return response?.ok ? response.payload.subjects : {};
  }

  get updateGradesError (): undefined | ErrorMessage[] {
    return mapErrors(
      this.updateGrades.response,
      payload => payload.record_id === undefined ? payload.errors : undefined,
    );
  }

  onChangeGrade (
    subject_id: string,
    person_id: string,
    value: string,
  ) {
    this.gradeChanges = Object.freeze({
      ...this.gradeChanges,
      [subject_id]: Object.freeze({
        ...this.gradeChanges?.[subject_id],
        [person_id]: value,
      }),
    });

    const savedValue = this.grades[subject_id]?.[person_id] ?? '';

    if (savedValue === value) {
      const newGrades = {
        ...this.gradeChanges,
        [subject_id]: {
          ...this.gradeChanges?.[subject_id],
          [person_id]: undefined,
        },
      };
      delete newGrades[subject_id][person_id];
      if (!Object.keys(newGrades[subject_id]).length) {
        delete newGrades[subject_id];
        if (!Object.keys(newGrades).length) {
          this.gradeChanges = null;
          return;
        }
      }
      Object.freeze(newGrades);
      Object.freeze(newGrades[subject_id]);
      this.gradeChanges = newGrades;
    }
  }

  async onSubmit () {
    if (!this.gradeChanges) return;

    await this.$api2.request(
      this.updateGrades,
      this.$api2.getQuery('groups', 'update_grades')({
        id: this.group.id,
        subjects: this.gradeChanges,
      }),
    );

    if (this.updateGrades.response?.ok &&
      this.updateGrades.response.payload.record_id) {
      this.reloading = true;
      window.location.reload();
    }
  }
}
</script>

<template>
  <div class="mt-3">
    <div v-if="isLoading" class="spinner-border" role="status">
      <span class="sr-only" />
    </div>
    <div v-else-if="!isDataPresent">
      <b-alert show variant="warning">
        <b-icon icon="exclamation-triangle-fill" class="mr-3" />
        <t value="app.processing.not_found" />
      </b-alert>
    </div>
    <div v-else>
      <ARecordsListing
        entity="people"
        :columns="columns"
        :actions-size="0"
        :params="listingParams"
        :static-per-page="100"
        @load="gradeChanges = null"
      >
        <template #prepend-body>
          <tr class="ema--data-table--tr__non_hoverable">
            <td />
            <td />
            <td />
            <td
              v-for="({ column, grading }) of SubjectColumns"
              :key="column.name"
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
          </tr>
        </template>
        <template #row="{ record }">
          <td class="d-flex align-items-center">
            <a-record-link
              :id="record.id"
              entity="people"
              class="mx-2"
            />
            <PrintFullName :person="record" />
          </td>
          <td
            v-for="({ column, subject, grading }) of SubjectColumns"
            :key="column.name"
          >
            <SubjectColumnField
              :grading="grading"
              :original-value="grades[subject.id]?.[record.id]"
              :value="gradeChanges?.[subject.id]?.[record.id]"
              @change="onChangeGrade(subject.id, record.id, $event)"
            />
          </td>
        </template>
        <template v-if="gradeChanges" #footer>
          <div class="card-footer d-flex justify-content-between">
            <div>
              <b-button
                variant="outline-success"
                :disabled="updateGrades.processing || reloading"
                @click="onSubmit"
              >
                <t value="app.action.save" />
              </b-button>
            </div>
            <div>
              <b-button
                variant="outline-secondary"
                :disabled="updateGrades.processing || reloading"
                @click="gradeChanges = null"
              >
                <t value="app.action.cancel" />
              </b-button>
            </div>
          </div>
          <div v-if="updateGradesError">
            <RecordErrors
              class="m-2"
              entity="groups"
              :errors="updateGradesError"
            />
          </div>
        </template>
      </ARecordsListing>
    </div>
  </div>
</template>
