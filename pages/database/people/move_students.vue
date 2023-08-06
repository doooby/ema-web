<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import ActionPage from '~/components/database/pages/ActionPage.vue';
import { MoveStudentsParams } from '~/components/database/records/groups/students/actions/MoveStudents.vue';
import { BRecord, GenericUpdateResponsePayload } from '~/lib/api2';
import BRecordsSelect from '~/components/database/controls/BRecordsSelect.vue';
import TextNames from '~/components/database/components/TextNames.vue';
import RecordErrors from '~/components/database/RecordErrors.vue';

@Component({
  components: { RecordErrors, TextNames, BRecordsSelect, ActionPage },
})
export default class MoveStudents extends DatabasePage {
  params: null | MoveStudentsParams = null;

  school: null | BRecord = null;
  course: null | BRecord = null;
  group: null | BRecord = null;

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
    this.school = data.fromGroup.school;
    this.course = data.fromGroup.course;
  }

  onChangeSchool (schools: BRecord[]): void {
    this.school = schools[0] ?? null;
    this.course = null;
    this.group = null;
  }

  onChangeCourse (courses: BRecord[]): void {
    this.course = courses[0] ?? null;
    this.group = null;
  }

  async onSubmit () {
    if (this.saveQueryState.processing) return;
    const params = {
      from_group_id: this.params!.fromGroup?.id,
      to_course_id: this.course!.id,
      to_group_id: this.group?.id,
      students_ids: this.params?.students.map(student => student.id),
    };
    await this.$api2.request(
      this.saveQueryState,
      this.$api2.getQuery('groups', 'move_students')(params),
    );
    if (this.saveQueryState.response?.ok && !this.saveQueryState.response.payload?.errors) {
      this.$router.push(`/database/groups/${this.params!.fromGroup.id}`);
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
                  <h4>
                    <t value="db.pages.people.move_students.from" />
                  </h4>
                  <div class="d-flex align-items-center">
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
                  <b-form-group label-for="move_to_school">
                    <template #label>
                      <t value="db.record.schools.meta.s" />
                    </template>
                    <b-records-select
                      dom-id="move_to_school"
                      entity="schools"
                      :single-record="true"
                      title="db.record.schools.meta.s"
                      :records="school ? [school] : []"
                      @change="onChangeSchool"
                    />
                  </b-form-group>
                  <b-form-group label-for="move_to_course">
                    <template #label>
                      <t value="db.record.courses.meta.s" />
                    </template>
                    <b-records-select
                      dom-id="move_to_course"
                      entity="courses"
                      :single-record="true"
                      title="db.record.courses.meta.s"
                      :records="course ? [course] : []"
                      :params="school ? { school_id: school.id } : undefined"
                      :disabled="school === null"
                      @change="onChangeCourse"
                    />
                  </b-form-group>
                  <b-form-group label-for="move_to_group">
                    <template #label>
                      <t value="db.record.groups.meta.s" />
                    </template>
                    <b-records-select
                      dom-id="move_to_group"
                      entity="groups"
                      :single-record="true"
                      title="db.record.groups.meta.s"
                      :records="group ? [group] : []"
                      :params="course ? { course_id: course.id } : undefined"
                      :disabled="course === null"
                      @change="group = $event[0] ?? null"
                    />
                  </b-form-group>
                  <b-alert
                    show
                    variant="info"
                  >
                    <t value="db.pages.people.move_students.empty_group" />
                  </b-alert>
                </div>

              </div>

              <record-errors class="mb-3" entity="groups" :errors="errors" />

            </div>

            <div class="card-footer d-flex justify-content-between">
              <div>
                <b-button
                  variant="outline-success"
                  :disabled="!params || !course"
                  @click="onSubmit"
                >
                  <t value="app.action.save" />
                </b-button>
              </div>
              <div>
                <b-button
                  variant="outline-secondary"
                  :to="`/database/groups/${params.fromGroup.id}`"
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
