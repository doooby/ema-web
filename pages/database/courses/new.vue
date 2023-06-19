<template>
  <new2-page
    entity="courses"
    :fields="fields"
    :show-after-create="true"
    :value="formValues"
    @change="formValues=$event"
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
import { SearchRecordsResponsePayload } from '~/lib/api2';

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
  async onStandardizedCourseChange (standardizedCourse) {
    if (standardizedCourse) {
      const query = this.$api2.newQueryState<
        SearchRecordsResponsePayload<
          standardized_course.StandardizedCourse
        >
      >();
      await this.$api2.request(
        query,
        this.$api2.getQuery('standardized_courses', 'search')({
          id: this.standardizedCourse.id,
        }),
      );
      const record = query.response?.ok && query.response.payload.records[0];
      if (record) {
        this.formValues = {
          ...this.formValues,
          grade: record.grade,
          is_formal: record.is_formal,
          accreditation_authority: record.accreditation_authority,
          lesson_duration: record.lesson_duration,
          attendance_limit: record.attendance_limit,
          subjects: record.subjects,
          education_level: record.education_level,
          name: record.name,
          preferred_grading: record.preferred_grading,
        };
      }
    }
  }
}
</script>
