<template>
  <new2-page
    v-model="formValues"
    entity="courses"
    :fields="fields"
    :show-after-create="true"
  >
    <template #layout="{ context, values }">
      <record-form :context="context" :values="values" />
    </template>
  </new2-page>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { course, standardized_course } from '~/lib/records';
import RecordForm from '~/components/database/records/courses/RecordForm.vue';
import New2Page from '~/components/database/pages/new/New2Page.vue';

@Component({
  components: { RecordForm, New2Page },
})
export default class extends DatabasePage {
  get fields () {
    return course.recordControls({
      countryData: this.$store.state.session.country,
    });
  }

  formValues: any = {}

  get standardizedCourse () {
    return this.formValues.standardized_course;
  }

  @Watch('standardizedCourse')
  async onStandardizedCourseChange (standardizedCourse, previous) {
    if (standardizedCourse && standardizedCourse !== previous) {
      const courseQuery = await this.$api2.fetchRecord<standardized_course.StandardizedCourse>(
        'standardized_courses', {
          id: standardizedCourse.id,
        },
      );
      const course = courseQuery.ok && courseQuery.payload.records[0];
      if (course) {
        this.formValues = {
          ...this.formValues,
          grade: course.grade,
          is_formal: course.is_formal,
          accreditation_authority: course.accreditation_authority,
          lesson_duration: course.lesson_duration,
          attendance_limit: course.attendance_limit,
          subjects: course.subjects,
          education_level: course.education_level,
          name: course.name,
          preferred_grading: course.preferred_grading,
        };
      }
    }
  }
}
</script>
