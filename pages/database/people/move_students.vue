<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import ActionPage, { ActionParams } from '~/components/database/pages/ActionPage.vue';
import { MoveStudentsParams } from '~/components/database/records/groups/students/actions/MoveStudents.vue';
import { BRecord, ErrorMessage, SearchRecordsResponsePayload, UpdatedRecordResponsePayload } from '~/lib/api2';
import BRecordsSelect from '~/components/database/controls/BRecordsSelect.vue';
import TextNames from '~/components/database/components/TextNames.vue';
import RecordErrors, { mapErrors } from '~/components/database/RecordErrors.vue';
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

  get errors (): undefined | ErrorMessage[] {
    return mapErrors(
      this.saveQueryState.response,
      payload => payload.record_id === undefined ? payload.errors : undefined,
    );
  }

  async onConnect ({
    params,
    onClean,
  }: ActionParams<MoveStudentsParams>): Promise<void> {
    this.onCleanAction = onClean;

    if (params.fromGroup) {
      const groupsResponse = await this.$api2.transientRequest<SearchRecordsResponsePayload<BRecord>>(
        this.$api2.getQuery('groups', 'searchB')({ id: params.fromGroup.groupId }),
      );
      if (groupsResponse.ok) {
        this.fromGroup = groupsResponse.payload.records[0] ?? null;
      }

      const schoolResponse = await this.$api2.transientRequest<SearchRecordsResponsePayload<BRecord>>(
        this.$api2.getQuery('schools', 'searchB')({ id: params.fromGroup.schoolId }),
      );
      if (schoolResponse.ok) {
        this.courseGroup.school = schoolResponse.payload.records[0] ?? null;
      }
      if (this.courseGroup.school) {
        const courseResponse = await this.$api2.transientRequest<SearchRecordsResponsePayload<BRecord>>(
          this.$api2.getQuery('courses', 'searchB')({ id: params.fromGroup.courseId }),
        );
        if (courseResponse.ok) {
          this.courseGroup.course = courseResponse.payload.records[0] ?? null;
        }
      }
    }

    const studentsResponse = await this.$api2.transientRequest<SearchRecordsResponsePayload<BRecord>>(
      this.$api2.getQuery('people', 'searchB')({ id: params.studentsIds }),
    );
    if (studentsResponse.ok) {
      this.students = studentsResponse.payload.records;
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
  <ActionPage @connect="onConnect">
    <div
      v-if="loaded"
      class="container pt-4 mb-5"
    >

      <div class="row">
        <div class="col justify-content-md-center">
          <div class="card">

            <div class="card-header">
              <h2 class="m-0">
                <t
                  v-if="fromGroup"
                  value="db.pages.people.move_students.title_move"
                />
                <t
                  v-else
                  value="db.pages.people.move_students.title_add"
                />
              </h2>
            </div>

            <div class="card-body pt-3 pb-0">

              <div class="row">

                <div class="col">

                  <div v-if="fromGroup">
                    <h4>
                      <t value="db.pages.people.move_students.from" />
                    </h4>
                    <div class="d-flex align-items-center">
                      <BRecordLink
                        entity="groups"
                        :record="fromGroup"
                        :new-tab="true"
                      />
                    </div>
                  </div>

                  <h4 class="mt-3">
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
                  <SelectCourseGroup
                    dom-id="move_to"
                    :value="courseGroup"
                  />
                </div>

              </div>

              <RecordErrors entity="groups" :errors="errors" />

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
