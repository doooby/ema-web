<script lang="ts">
import { Component, Watch } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import PeopleListing from '~/components/database/records/people/PeopleListing.vue';
import MoveStudents from '~/components/database/records/groups/students/actions/MoveStudents.vue';
import IndexPage2 from '~/components/database/pages/index/IndexPage2.vue';
import NewRecordButton from '~/components/database/pages/index/NewRecordButton.vue';
import SearchForm from '~/components/database/pages/index/SearchForm.vue';
import controls from '~/components/controls';
import { BRecordsSelect, OptionsSelect } from '~/components/controls/inputs';
import app from '~/lib/app';
import SchoolsFilter from '~/components/views/application/filters/records/SchoolsFilter.vue';
import CoursesFilter from '~/components/views/application/filters/records/CoursesFilter.vue';
import GroupsFilter from '~/components/views/application/filters/records/GroupsFilter.vue';
import HasDropoutFilter from '~/components/views/student/filters/HasDropoutFilter.vue';
import PersonResidencyStatus from '~/components/views/student/filters/PersonResidencyStatus.vue';

const onlyExcludeOptions = app.country.defaults.options.onlyExclude();

@Component({
  components: {
    PersonResidencyStatus,
    HasDropoutFilter,
    GroupsFilter,
    CoursesFilter,
    SchoolsFilter,
    OptionsSelect,
    BRecordsSelect,
    SearchForm,
    PeopleListing,
    NewRecordButton,
    IndexPage2,
    MoveStudents,
  },
})
export default class extends DatabasePage {
  searchControls = controls.Group.compose();
  searchParams = {
    students: this.searchControls.getParams(),
  };

  created () {
    this.reCreateSearchControls();
  }

  @Watch('currentCountry')
  reCreateSearchControls () {
    const current_school_year = this.currentCountry?.current_school_year;

    this.searchControls = controls.Group.compose(
      {
        ...SchoolsFilter.asField('schools', 'school_id'),
        onChange: (values) => {
          values.courses = undefined;
          values.groups = undefined;
          values.non_classified = undefined;
        },
      },
      {
        ...CoursesFilter.asField('courses', 'course_id'),
        onChange: (values) => {
          values.groups = undefined;
          values.non_classified = undefined;
        },
      },
      {
        ...GroupsFilter.asField('groups', 'group_id'),
        onChange: (values) => {
          values.non_classified = undefined;
        },
      },
      {
        name: 'school_years',
        default: () => current_school_year && [ current_school_year ],
        populateParams: (values: any, params) => {
          params.school_year_id = values.school_years?.map(b => b.id);
        },
        onChange: (values) => {
          values.courses = undefined;
          values.groups = undefined;
          values.non_classified = undefined;
        },
      },
      {
        name: 'standardized_courses',
        populateParams: (values: any, params) => {
          params.standardized_course_id =
            values.standardized_courses?.map(b => b.id);
        },
      },
      {
        name: 'non_classified',
        options: onlyExcludeOptions as any,
        populateParams: (values: any, params) => {
          params.non_classified =
            values.non_classified?.map(b => b.value)?.[0];
        },
      },
      {
        name: 'gender',
        options: app.internalOptionsList2(
          this.$store.state.session.country,
          'gender',
        ) as app.OptionItem[],
        populateParams: (values: any, params) => {
          params.gender = values.gender?.map(b => b.value)?.[0];
        },
      },
      HasDropoutFilter.asField('dropout', 'dropout'),
      PersonResidencyStatus.asField('residency', 'residency'),
    );
    this.searchParams = {
      students: this.searchControls.getParams(),
    };
  }
}
</script>

<template>
  <IndexPage2
    :search-controls="searchControls"
    @search="searchParams = { students: $event }"
  >

    <template #header>
      <h4 class="m-0">
        <t value="db.menu.resource.people" />
      </h4>
      <b-tabs class="mt-3">
        <b-tab active>
          <template #title>
            <t value="db.menu.title.students" />
          </template>
        </b-tab>
        <b-tab @click="$router.push('/database/people')">
          <template #title>
            <t value="db.menu.title.all_people" />
          </template>
        </b-tab>
      </b-tabs>
    </template>

    <template #search-form="{ group }">
      <div class="col-md-4 col-lg-3">
        <SchoolsFilter
          :controls="group"
          field-name="schools"
        />
        <CoursesFilter
          :controls="group"
          field-name="courses"
          :params="{ school_id: group.getParam('school_id'), school_year_id: group.getParam('school_year_id') }"
        />
        <GroupsFilter
          :controls="group"
          field-name="groups"
          :params="{ course_id: group.getParam('course_id') }"
        />
      </div>
      <div class="col-md-4 col-lg-3">
        <b-form-group
          label-for="students_filters_school_years"
        >
          <template #label>
            <t value="db.record.school_years.meta.s" />
          </template>
          <template #default="{ labelId }">
            <BRecordsSelect
              :dom-id="labelId"
              :value="group.getValue('school_years')"
              entity="school_years"
              :multiple="true"
              @change="group.update('school_years', $event)"
            />
          </template>
        </b-form-group>
        <b-form-group
          class="mt-2"
          label-for="students_filters_standardized_courses"
        >
          <template #label>
            <t value="db.record.standardized_courses.meta.s" />
          </template>
          <template #default="{ labelId }">
            <BRecordsSelect
              :dom-id="labelId"
              :value="group.getValue('standardized_courses')"
              entity="standardized_courses"
              :multiple="true"
              @change="group.update('standardized_courses', $event)"
            />
          </template>
        </b-form-group>
        <b-form-group
          class="mt-2"
        >
          <template #label>
            <t value="db.record.groups.filters.non_classified.label" />
          </template>
          <OptionsSelect
            :value="group.getValue('non_classified')"
            :options="group.fieldsIndex.non_classified?.options ?? []"
            @change="group.update('non_classified', $event)"
          >
            <template #option-content="{ option, selected }">
              <input type="radio" :checked="selected" class="mr-1">
              <t :value="option.item" />
            </template>
          </OptionsSelect>
        </b-form-group>
      </div>
      <div class="col-md-4 col-lg-3">
        <b-form-group
          class="mt-2"
        >
          <template #label>
            <t value="db.record.people.filters.gender.label" />
          </template>
          <OptionsSelect
            :value="group.getValue('gender')"
            :options="group.fieldsIndex.gender?.options ?? []"
            @change="group.update('gender', $event)"
          >
            <template #option-content="{ option, selected }">
              <input type="radio" :checked="selected" class="mr-1">
              <t :value="option.item" />
            </template>
          </OptionsSelect>
        </b-form-group>
        <HasDropoutFilter
          v-if="$ema.canI('act:/ff_t116')"
          :controls="group"
          field-name="dropout"
        />
        <PersonResidencyStatus
          :controls="group"
          field-name="residency"
        />
      </div>

    </template>

    <PeopleListing
      class="mt-3"
      :params="searchParams"
      :hide-contract="true"
    >
      <template
        v-if="$admission.can('groups.move_students')"
        #group-actions="{ records }"
      >
        <MoveStudents :students="records" />
      </template>
    </PeopleListing>

  </IndexPage2>
</template>
