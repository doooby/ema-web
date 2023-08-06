<template>
  <new2-page
    entity="people"
    :fields="fields"
    :show-after-create="true"
  >
    <template #layout="{ context, values }">
      <record-form :context="context" :values="values" />
      <div class="row">
        <div class="col-12">
          <div class="border-bottom my-2" />
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <h4 class="d-flex align-items-center">
            <t value="db.pages.people.new.move_to_course" />
            <b-button
              v-b-toggle="'collapse__move_to_course'"
              class="ml-3"
              variant="outline-secondary"
            >
              <b-icon :icon="moveToCourseShown ? 'chevron-up' : 'chevron-down'" />
            </b-button>
          </h4>
          <b-collapse
            id="collapse__move_to_course"
            class="mt-2"
            @input="moveToCourseShown = $event"
          >
            <SelectCourseGroup :value="moveToCourse" />
          </b-collapse>
        </div>
      </div>
    </template>
  </new2-page>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { person } from '~/lib/records';
import RecordForm from '~/components/database/records/people/RecordForm.vue';
import New2Page from '~/components/database/pages/new/New2Page.vue';
import SelectCourseGroup, { CourseGroup } from '~/components/database/records/courses/controls/SelectCourseGroup.vue';

@Component({
  components: { RecordForm, New2Page, SelectCourseGroup },
})
export default class extends DatabasePage {
  moveToCourse: CourseGroup = {
    school: null,
    course: null,
    group: null,
  }

  moveToCourseShown = false;

  @Watch('moveToCourseShown')
  onMoveToCourseShownChanged (value: boolean) {
    if (!value) {
      this.moveToCourse.school = null;
      this.moveToCourse.course = null;
      this.moveToCourse.group = null;
    }
  }

  get fields () {
    return [
      ...person.recordControls({
        countryData: this.$store.state.session.country,
      }),
      [ 'move_to_course', {
        control: true,
        fillParams: ({ name }, _, record) => {
          console.log(this.moveToCourse);
          if (this.moveToCourse.course) {
            record[name] = {
              id: this.moveToCourse.course.id,
              group_id: this.moveToCourse.group?.id,
            };
          }
          return record;
        },
      } ],
    ];
  }

  // onChange (newValues) {
  //   if (!newValues.disabilities?.length) {
  //     newValues = {
  //       ...newValues,
  //       disability_diagnosis: undefined,
  //       assistance_needed: undefined,
  //       assistance_provided: undefined,
  //       disability_note: undefined,
  //     };
  //   }
  //   this.values = newValues;
  // }
}
</script>
