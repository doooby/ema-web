<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import ActionPage, { ActionParams } from '~/components/database/pages/ActionPage.vue';
import { MoveStudentsParams } from '~/components/database/records/groups/students/actions/MoveStudents.vue';
import { BRecord, SearchRecordsResponsePayload, UpdatedRecordResponsePayload } from '~/lib/api2';
import BRecordsSelect from '~/components/database/controls/BRecordsSelect.vue';
import TextNames from '~/components/database/components/TextNames.vue';
import RecordErrors from '~/components/database/RecordErrors.vue';
import SelectCourseGroup, { CourseGroup } from '~/components/database/records/courses/controls/SelectCourseGroup.vue';
import BRecordLink from '~/components/database/components/BRecordLink.vue';

@Component({
  components: {
    BRecordLink,
    SelectCourseGroup,
    RecordErrors,
    TextNames,
    BRecordsSelect,
    ActionPage,
  },
})
export default class MoveStudents extends DatabasePage {
  loaded = false;
  fromGroup: null | BRecord = null;
  students: BRecord[] = [];
  courseGroup: CourseGroup = {
    school: null,
    course: null,
    group: null,
  }

  saveQueryState = this.$api2.newQueryState<UpdatedRecordResponsePayload>();
  onCleanAction?: () => void;

  get errors (): undefined | [string, string][] {
    const response = this.saveQueryState.response;
    if (response?.ok === false) {
      return [ [ 'server', response.message ] ];
    }

    if (response?.ok && response.payload.record_id === undefined) {
      if (response.payload.errors.length) {
        return response.payload.errors;
      }
    }
  }

  async onConnect ({
    params,
    onClean,
  }: ActionParams<MoveStudentsParams>): Promise<void> {
    this.onCleanAction = onClean;

    if (params.fromGroup) {
      const groupsResult = await this.$api2.transientRequest<SearchRecordsResponsePayload<BRecord>>(
        this.$api2.getQuery('groups', 'searchB')({ id: params.fromGroup.groupId }),
      );
      if (groupsResult.response?.ok) {
        this.fromGroup = groupsResult.response.payload.records[0] ?? null;
      }

      const schoolResult = await this.$api2.transientRequest<SearchRecordsResponsePayload<BRecord>>(
        this.$api2.getQuery('schools', 'searchB')({ id: params.fromGroup.schoolId }),
      );
      if (schoolResult.response?.ok) {
        this.courseGroup.school = schoolResult.response.payload.records[0] ?? null;
      }
      if (this.courseGroup.school) {
        const courseResult = await this.$api2.transientRequest<SearchRecordsResponsePayload<BRecord>>(
          this.$api2.getQuery('courses', 'searchB')({ id: params.fromGroup.courseId }),
        );
        if (courseResult.response?.ok) {
          this.courseGroup.course = courseResult.response.payload.records[0] ?? null;
        }
      }
    }

    const studentsResult = await this.$api2.transientRequest<SearchRecordsResponsePayload<BRecord>>(
      this.$api2.getQuery('people', 'searchB')({ id: params.studentsIds }),
    );
    if (studentsResult.response?.ok) {
      this.students = studentsResult.response.payload.records;
    }

    this.loaded = true;
  }

  async onSubmit () {
    if (this.saveQueryState.processing) return;
    const params = {
      from_group_id: this.fromGroup?.id,
      to_course_id: this.courseGroup.course!.id,
      to_group_id: this.courseGroup.group?.id,
      students_ids: this.students.map(person => person.id),
    };
    await this.$api2.request(
      this.saveQueryState,
      this.$api2.getQuery('groups', 'move_students')(params),
    );
    if (this.saveQueryState.response?.ok && this.saveQueryState.response.payload?.record_id) {
      this.onCleanAction?.();
      this.$router.push(this.returnPah);
    }
  }

  get returnPah (): string {
    const response = this.saveQueryState.response;
    const groupId = (response?.ok && response.payload.record_id) || this.fromGroup?.id;
    if (groupId) {
      return `/database/groups/${groupId}`;
    } else {
      return '/database/people';
    }
  }
}
</script>

<template>
  <ActionPage
    class="page-content"
    @connect="onConnect"
  >
    <div
      v-if="loaded"
      class="container pt-4 mb-5"
    >

      <div class="row">
        <div class="col justify-content-md-center">
          <div class="card">

            <div class="card-header">
              <h2 class="m-0">
                <t value="db.pages.people.move_students.title" />
              </h2>
            </div>

            <div class="card-body pt-3 pb-0">

              <div class="row">

                <div class="col">
                  <h4 v-if="fromGroup">
                    <t value="db.pages.people.move_students.from" />
                  </h4>
                  <div
                    v-if="fromGroup"
                    class="d-flex align-items-center"
                  >
                    <BRecordLink
                      entity="groups"
                      :record="fromGroup"
                      :new-tab="true"
                    />
                  </div>
                  <h4 :class="{ 'mt-3': fromGroup }">
                    <t value="db.pages.people.move_students.students" />
                  </h4>
                  <div class="d-flex align-items-center flex-wrap">
                    <div
                      v-for="(student, index) in students"
                      :key="student.id"
                    >
                      <span v-if="index !== 0">, </span>
                      <BRecordLink
                        entity="people"
                        :record="student"
                        :new-tab="true"
                      />
                    </div>
                  </div>
                </div>

                <div class="col">
                  <h4>
                    <t value="db.pages.people.move_students.to" />
                  </h4>
                  <SelectCourseGroup :value="courseGroup" />
                </div>

              </div>

              <record-errors class="mb-3" entity="groups" :errors="errors" />

            </div>

            <div class="card-footer d-flex justify-content-between">
              <div>
                <b-button
                  variant="outline-success"
                  :disabled="!courseGroup.course"
                  @click="onSubmit"
                >
                  <t value="app.action.save" />
                </b-button>
              </div>
              <div>
                <b-button
                  variant="outline-secondary"
                  :to="returnPah"
                  :disabled="saveQueryState.processing"
                  @click="onCleanAction"
                >
                  <t value="app.action.cancel" />
                </b-button>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  </ActionPage>
</template>
