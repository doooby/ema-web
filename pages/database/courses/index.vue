<script lang="ts">
import { Component, Watch } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import CoursesListing from '~/components/database/records/courses/CoursesListing.vue';
import IndexPage2 from '~/components/database/pages/index/IndexPage2.vue';
import controls from '~/components/controls';
import NewRecordButton from '~/components/database/pages/index/NewRecordButton.vue';
import { BRecordsSelect } from '~/components/controls/inputs';

@Component({
  components: {
    CoursesListing,
    NewRecordButton,
    IndexPage2,
    BRecordsSelect,
  },
})
export default class extends DatabasePage {
  searchControls = controls.Group.compose();
  searchParams = this.searchControls.getParams();

  created () {
    this.reCreateSearchControls();
  }

  @Watch('currentCountry')
  reCreateSearchControls () {
    const current_school_year = this.currentCountry?.current_school_year;

    this.searchControls = controls.Group.compose(
      {
        name: 'project',
        populateParams: (values: any, params) => {
          params.project_id = values.project?.map(b => b.id)?.[0];
        },
        onChange: (values) => {
          values.school = undefined;
        },
      },
      {
        name: 'school',
        populateParams: (values: any, params) => {
          params.school_id = values.school?.map(b => b.id)?.[0];
        },
      },
      {
        name: 'standardized_course',
        populateParams: (values: any, params) => {
          params.standardized_course_id =
            values.standardized_course?.map(b => b.id)?.[0];
        },
      },
      {
        name: 'school_year',
        default: () => {
          if (!current_school_year) return;
          return [ {
            id: current_school_year.id,
            caption: current_school_year.caption,
          } ];
        },
        populateParams: (values: any, params) => {
          params.school_year_id = values.school_year?.map(b => b.id)?.[0];
        },
      },
    );
    this.searchParams = this.searchControls.getParams();
  }
}
</script>

<template>
  <IndexPage2
    entity="courses"
    :search-controls="searchControls"
    @search="searchParams = $event"
  >

    <template
      v-if="$admission.can('courses.create')"
      #resource-actions
    >
      <NewRecordButton entity="courses" />
    </template>

    <template #search-form="{ group }">
      <div class="col-md-4 col-lg-3">
        <b-form-group
          label-for="courses_filters_project"
        >
          <template #label>
            <t value="db.record.projects.meta.s" />
          </template>
          <template #default="{ labelId }">
            <BRecordsSelect
              :dom-id="labelId"
              :value="group.getValue('project')"
              entity="projects"
              @change="group.update('project', $event)"
            />
          </template>
        </b-form-group>
        <b-form-group
          class="mt-2"
          label-for="courses_filters_school"
        >
          <template #label>
            <t value="db.record.schools.meta.s" />
          </template>
          <template #default="{ labelId }">
            <BRecordsSelect
              :dom-id="labelId"
              :value="group.getValue('school')"
              entity="schools"
              :params="{ project_id: group.getParam('project_id') }"
              @change="group.update('school', $event)"
            />
          </template>
        </b-form-group>
      </div>
      <b-form-group
        class="col-md-4 col-lg-3"
        label-for="courses_filters_standardized_course"
      >
        <template #label>
          <t value="db.record.standardized_courses.meta.s" />
        </template>
        <template #default="{ labelId }">
          <BRecordsSelect
            :dom-id="labelId"
            :value="group.getValue('standardized_course')"
            entity="standardized_courses"
            @change="group.update('standardized_course', $event)"
          />
        </template>
      </b-form-group>
      <b-form-group
        class="col-md-4 col-lg-3"
        label-for="courses_filters_school_year"
      >
        <template #label>
          <t value="db.record.school_years.meta.s" />
        </template>
        <template #default="{ labelId }">
          <BRecordsSelect
            :dom-id="labelId"
            :value="group.getValue('school_year')"
            entity="school_years"
            @change="group.update('school_year', $event)"
          />
        </template>
      </b-form-group>
    </template>

    <CoursesListing
      class="mt-3"
      :params="searchParams"
    />

  </IndexPage2>
</template>
