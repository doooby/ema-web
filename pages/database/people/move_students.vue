<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import ActionPage from '~/components/database/pages/ActionPage.vue';
import { MoveStudentsParams } from '~/components/database/records/groups/students/actions/MoveStudents.vue';
import { GenericUpdateResponsePayload } from '~/lib/api2';
import BRecordsSelect from '~/components/database/controls/BRecordsSelect.vue';
import TextNames from '~/components/database/components/TextNames.vue';
import RecordErrors from '~/components/database/RecordErrors.vue';
import SelectCourseGroup, { CourseGroup } from '~/components/database/records/courses/controls/SelectCourseGroup.vue';

@Component({
  components: {
    SelectCourseGroup,
    RecordErrors,
    TextNames,
    BRecordsSelect,
    ActionPage,
  },
})
export default class MoveStudents extends DatabasePage {
  params: null | MoveStudentsParams = null;
  courseGroup: CourseGroup = {
    school: null,
    course: null,
    group: null,
  }

  saveQueryState = this.$api2.newQueryState<GenericUpdateResponsePayload>();

  get errors (): undefined | [string, string][] {
    const response = this.saveQueryState.response;
    if (response?.ok === false) {
      return [ [ 'server', response.message ] ];
    }

    if (response?.ok && response.payload?.errors) {
      if (response.payload.errors.length) {
        return response.payload.errors;
      }
    }
  }

  onConnect (data: MoveStudentsParams): void {
    this.params = data;
    this.courseGroup.school = data.fromGroup?.school ?? null;
    this.courseGroup.course = data.fromGroup?.course ?? null;
  }

  async onSubmit () {
    if (this.saveQueryState.processing) return;
    const params = {
      from_group_id: this.params!.fromGroup?.id,
      to_course_id: this.courseGroup.course!.id,
      to_group_id: this.courseGroup.group?.id,
      students_ids: this.params?.students.map(student => student.id),
    };
    await this.$api2.request(
      this.saveQueryState,
      this.$api2.getQuery('groups', 'move_students')(params),
    );
    if (this.saveQueryState.response?.ok && !this.saveQueryState.response.payload?.errors) {
      this.$router.push(this.returnPah);
    }
  }

  get returnPah (): string {
    if (this.params?.fromGroup) {
      return `/database/groups/${this.params.fromGroup.id}`;
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
      v-if="params"
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
                  <h4 v-if="params.fromGroup">
                    <t value="db.pages.people.move_students.from" />
                  </h4>
                  <div
                    v-if="params.fromGroup"
                    class="d-flex align-items-center"
                  >
                    <code>[{{ params.fromGroup.id }}]</code>
                  </div>
                  <h4 class="mt-3">
                    <t value="db.pages.people.move_students.students" />
                  </h4>
                  <div class="d-flex align-items-center">
                    <div
                      v-for="(student, index) in params.students"
                      :key="student.id"
                    >
                      <span v-if="index !== 0">, </span>
                      <code>[{{ student.id }}]</code>
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
                  :disabled="!params || !courseGroup.course"
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
