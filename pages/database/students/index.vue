<script lang="ts">
import { Component, Watch } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import PeopleListing from '~/components/database/records/people/PeopleListing.vue';
import MoveStudents from '~/components/database/records/groups/students/actions/MoveStudents.vue';
import IndexPage2 from '~/components/database/pages/index/IndexPage2.vue';
import NewRecordButton from '~/components/database/pages/index/NewRecordButton.vue';
import SearchForm from '~/components/database/pages/index/SearchForm.vue';
import controls from '~/components/controls';
import BRecordsSelect from '~/components/controls/inputs/BRecordsSelect.vue';
import OptionsSelect from '~/components/controls/inputs/OptionsSelect.vue';
import app from '~/lib/app';

const nonAssignedOptions = Object.freeze([
  { value: 'only', item: 'db.record.groups.filters.non_classified.only' },
  { value: 'exclude', item: 'db.record.groups.filters.non_classified.exclude' },
]);

@Component({
  components: {
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
        name: 'schools',
        populateParams: (values: any, params) => {
          params.school_id = values.schools?.map(b => b.id);
        },
        onChange: (values) => {
          values.courses = undefined;
          values.groups = undefined;
          values.non_classified = undefined;
        },
      },
      {
        name: 'courses',
        populateParams: (values: any, params) => {
          params.course_id = values.courses?.map(b => b.id);
        },
        onChange: (values) => {
          values.groups = undefined;
          values.non_classified = undefined;
        },
      },
      {
        name: 'groups',
        populateParams: (values: any, params) => {
          params.group_id = values.groups?.map(b => b.id);
        },
        onChange: (values) => {
          values.non_classified = undefined;
        },
      },
      {
        name: 'school_years',
        default: () => {
          if (!current_school_year) return;
          return [ {
            id: current_school_year.id,
            caption: current_school_year.caption,
          } ];
        },
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
        options: nonAssignedOptions as any,
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
        ) as any,
        populateParams: (values: any, params) => {
          params.gender = values.gender?.map(b => b.value)?.[0];
        },
      },
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
        <b-form-group
          v-slot="{ labelId }"
          :label="$t('db.record.schools.meta.p')"
          label-for="students_filters_schools"
        >
          <BRecordsSelect
            :dom-id="labelId"
            :value="group.getValue('schools')"
            entity="schools"
            :multiple="true"
            @change="group.update('schools', $event)"
          />
        </b-form-group>
        <b-form-group
          v-slot="{ labelId }"
          :label="$t('db.record.courses.meta.p')"
          label-for="students_filters_courses"
        >
          <BRecordsSelect
            :dom-id="labelId"
            :value="group.getValue('courses')"
            entity="courses"
            :multiple="true"
            :params="{ school_id: group.getParam('school_id'), school_year_id: group.getParam('school_year_id') }"
            @change="group.update('courses', $event)"
          />
        </b-form-group>
        <b-form-group
          v-slot="{ labelId }"
          class="mt-2"
          :label="$t('db.record.groups.meta.p')"
          label-for="students_filters_groups"
        >
          <BRecordsSelect
            :dom-id="labelId"
            :value="group.getValue('groups')"
            entity="groups"
            :multiple="true"
            :params="{ course_id: group.getParam('course_id') }"
            @change="group.update('groups', $event)"
          />
        </b-form-group>
      </div>
      <div class="col-md-4 col-lg-3">
        <b-form-group
          v-slot="{ labelId }"
          :label="$t('db.record.school_years.meta.s')"
          label-for="students_filters_school_years"
        >
          <BRecordsSelect
            :dom-id="labelId"
            :value="group.getValue('school_years')"
            entity="school_years"
            :multiple="true"
            @change="group.update('school_years', $event)"
          />
        </b-form-group>
        <b-form-group
          v-slot="{ labelId }"
          class="mt-2"
          :label="$t('db.record.standardized_courses.meta.s')"
          label-for="students_filters_standardized_courses"
        >
          <BRecordsSelect
            :dom-id="labelId"
            :value="group.getValue('standardized_courses')"
            entity="standardized_courses"
            :multiple="true"
            @change="group.update('standardized_courses', $event)"
          />
        </b-form-group>
        <b-form-group
          class="mt-2"
          :label="$t('db.record.groups.filters.non_classified.label')"
        >
          <OptionsSelect
            :value="group.getValue('non_classified')"
            :options="group.fieldsIndex.non_classified?.options ?? []"
            @change="group.update('non_classified', $event)"
          >
            <template #options="{options, isSelected, onToggleOption}">
              <li
                v-for="option in options"
                :key="option.value"
                class="list-group-item list-group-item-action d-flex"
                style="cursor: pointer;"
                @click="onToggleOption(option)"
              >
                <input type="radio" :checked="isSelected(option)">
                <span class="ml-4">
                  <t :value="option.item" />
                </span>
              </li>
            </template>
          </OptionsSelect>
        </b-form-group>
      </div>
      <div class="col-md-4 col-lg-3">
        <b-form-group
          class="mt-2"
          :label="$t('db.record.people.filters.gender.label')"
        >
          <OptionsSelect
            :value="group.getValue('gender')"
            :options="group.fieldsIndex.gender?.options ?? []"
            @change="group.update('gender', $event)"
          >
            <template #options="{options, isSelected, onToggleOption}">
              <li
                v-for="option in options"
                :key="option.value"
                class="list-group-item list-group-item-action d-flex"
                style="cursor: pointer;"
                @click="onToggleOption(option)"
              >
                <input type="radio" :checked="isSelected(option)">
                <span class="ml-4">
                  <t :value="option.item" />
                </span>
              </li>
            </template>
          </OptionsSelect>
        </b-form-group>
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
