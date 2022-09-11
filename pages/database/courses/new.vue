<template>
  <new-page
    :processing="processing"
    entity="courses"
    :value="values"
    :fields="fields"
    card-class="col-md-12 col-lg-8"
    @created="onCreated"
    @change="onChange"
  >
    <template #layout="{ context, values }">
      <div class="row">
        <div class="col-md-6">
          <form-field name="school" :context="context" :values="values" />
        </div>
        <div class="col-12">
          <div class="border-bottom my-2" />
        </div>
        <div class="col-md-6">
          <form-field name="school_year" :context="context" :values="values" />
        </div>
        <div class="col-md-6">
          <form-field name="time_ranges" :context="context" :values="values" />
        </div>
        <div class="col-12">
          <div class="border-bottom my-2" />
        </div>
        <div class="col-md-6">
          <form-field name="standardized_course" :context="context" :values="values" />
          <form-field name="name" :context="context" :values="values" />
          <form-field name="education_level" :context="context" :values="values" />
          <form-field name="grade" :context="context" :values="values" />
          <form-field name="is_formal" :context="context" :values="values" />
          <form-field name="accreditation_authority" :context="context" :values="values" />
        </div>
        <div class="col-md-6">
          <form-field name="lesson_duration" :context="context" :values="values" />
          <form-field name="attendance_limit" :context="context" :values="values" />
          <form-field name="preferred_grading" :context="context" :values="values" />
          <form-field name="description" :context="context" :values="values" />
        </div>
        <div class="col-12">
          <form-field name="subjects" :context="context" :values="values" />
        </div>
      </div>
    </template>
  </new-page>
</template>

<script lang="ts">
import NewPage from '~/components/database/NewPage.vue';
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { FormFieldDefinition } from '~/components/Form';
import { course } from '~/lib/records';

@Component({
  components: { NewPage },
})
export default class extends DatabasePage {
  processing = true;

  values = {} as any;

  async mounted () {
    if (this.$route.query.school_id) {
      const result = await this.$api.request(
        this.$api.queries.schools.searchAssociated({
          country_id: this.$store.getters['session/countryId'],
          id: this.$route.query.school_id,
          per_page: 1,
        }),
        this.$api.newQueryState(),
      );
      if (result?.records?.[0]) {
        this.values = { ...this.values, school: result.records[0] };
      }
    }

    this.processing = false;
  }

  get fields (): FormFieldDefinition[] {
    return course.recordControls({ countryId: this.currentCountryId });
  }

  onCreated (recordId: Number) {
    this.$router.push({ path: `/database/courses/${recordId}` });
  }

  async onChange (newValues) {
    const oldValues = this.values;
    this.values = newValues;
    if (newValues.school_year &&
      newValues.school_year.id !== oldValues.school_year?.id) {
      await this.fillPerSchoolYear(newValues);
    }
    if (newValues.standardized_course &&
      newValues.standardized_course.id !== oldValues.standardized_course?.id) {
      await this.fillPerStandardizedCourse(newValues);
    }
  }

  async fillPerSchoolYear (values) {
    this.processing = true;

    const result = await this.$api.request(
      this.$api.queries.school_years.show(values.school_year.id),
      this.$api.newQueryState(),
    );
    if (result?.success) {
      this.values = {
        ...values,
        time_ranges: result.record.terms,
      };
    } else {
      this.values = {
        ...values,
        school_year: null,
      };
    }

    this.processing = false;
  }

  async fillPerStandardizedCourse (values) {
    this.processing = true;

    const result = await this.$api.request(
      this.$api.queries.standardized_courses.show(values.standardized_course.id),
      this.$api.newQueryState(),
    );
    if (result?.success) {
      this.values = course.updateFormPerStandardizedCourse(values, result.record);
    } else {
      this.values = {
        ...values,
        standardized_course: null,
      };
    }

    this.processing = false;
  }
}
</script>
