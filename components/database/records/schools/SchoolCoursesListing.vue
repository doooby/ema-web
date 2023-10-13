<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { school, user } from '~/lib/records';
import CoursesListing from '~/components/database/records/courses/CoursesListing.vue';
import controls from '~/components/controls';
import SearchForm from '~/components/database/pages/index/SearchForm.vue';
import BRecordsSelect from '~/components/controls/inputs/BRecordsSelect.vue';

@Component({
  components: {
    BRecordsSelect,
    SearchForm,
    CoursesListing,
  },
})
export default class SchoolCoursesListing extends Vue {
  @Prop({ required: true }) readonly school!: school.School;

  searchControls = controls.Group.compose();
  searchParams = this.searchControls.getParams();

  created () {
    this.reCreateSearchControls();
  }

  get currentCountry (): null | user.CurrentCountrySlice {
    return this.$store.state.session.currentCountry;
  }

  @Watch('currentCountry')
  reCreateSearchControls () {
    const current_school_year = this.currentCountry?.current_school_year;

    this.searchControls = controls.Group.compose(
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
  <div class="mt-3">
    <SearchForm
      :group="searchControls"
      @search="searchParams = searchControls.getParams()"
    >
      <b-form-group
        v-slot="{ labelId }"
        class="col-md-4 col-lg-3"
        :label="$t('db.record.standardized_courses.meta.s')"
        label-for="courses_filters_standardized_course"
      >
        <BRecordsSelect
          :dom-id="labelId"
          :value="searchControls.getValue('standardized_course')"
          entity="standardized_courses"
          @change="searchControls.update('standardized_course', $event)"
        />
      </b-form-group>
      <b-form-group
        v-slot="{ labelId }"
        class="col-md-4 col-lg-3"
        :label="$t('db.record.school_years.meta.s')"
        label-for="courses_filters_school_year"
      >
        <BRecordsSelect
          :dom-id="labelId"
          :value="searchControls.getValue('school_year')"
          entity="school_years"
          @change="searchControls.update('school_year', $event)"
        />
      </b-form-group>
    </SearchForm>
    <CoursesListing
      class="mt-3"
      :params="searchParams"
      :school="school"
    />
  </div>
</template>
