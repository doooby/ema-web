<template>
  <edit-page
    entity="standardized_courses"
    :fields="fields"
    card-class="col-md-12 col-lg-8"
  >
    <template #layout="{ context, values }">
      <div class="row">
        <div class="col-md-6">
          <form-field name="name" :context="context" :values="values" />
          <form-field name="education_level" :context="context" :values="values" />
          <form-field name="grade" :context="context" :values="values" />
          <form-field name="accreditation_authority" :context="context" :values="values" />
        </div>
        <div class="col-md-6">
          <form-field name="lesson_duration" :context="context" :values="values" />
          <form-field name="attendance_limit" :context="context" :values="values" />
          <form-field name="preferred_grading" :context="context" :values="values" />
          <form-field name="description" :context="context" :values="values" />
        </div>
        <div class="col">
          <form-field name="subjects" :context="context" :values="values" />
        </div>
      </div>
    </template>
  </edit-page>
</template>

<script lang="ts">
import EditPage from '~/components/database/EditPage.vue';
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { FormFieldDefinition } from '~/components/Form';
import { standardizedCourse } from '~/lib/records';

@Component({
  components: { EditPage },
})
export default class extends DatabasePage {
  get fields (): FormFieldDefinition[] {
    return standardizedCourse.recordControls(this.currentCountryId);
  }
}
</script>
