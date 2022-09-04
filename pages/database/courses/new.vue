<template>
  <new-page
    :prefetching="prefetching"
    entity="courses"
    :values="values"
    :fields="fields"
    card-class="col-md-12 col-lg-8"
    @created="onCreated"
  >
    <template #layout="{ context, values }">
      <div class="row">
        <div class="col-md-6">
          <form-field name="school" :context="context" :values="values" />
          <form-field name="standardized_course" :context="context" :values="values" />
        </div>
        <div class="col-md-6">
          <form-field name="school_year" :context="context" :values="values" />
          <form-field name="time_range" :context="context" :values="values" />
        </div>
        <div class="col-12">
          <div class="border-bottom my-2" />
        </div>
        <div class="col-md-6">
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
  prefetching = true;

  values = {};

  async mounted () {
    if (this.$route.params.school_id) {
      const result = await this.$api.request(
        this.$api.queries.schools.searchAssociated({
          country_id: this.$store.getters['session/countryId'],
          id: this.$route.params.school_id,
          per_page: 1,
        }),
        this.$api.newQueryState(),
      );
      if (result?.records?.[0]) {
        this.values = { ...this.values, school: result.records[0] };
      }
    }

    this.prefetching = false;
  }

  get fields (): FormFieldDefinition[] {
    return course.recordControls({ countryId: this.currentCountryId });
  }

  onCreated (recordId: Number) {
    this.$router.push({ path: `/database/courses/${recordId}` });
  }
}
</script>
