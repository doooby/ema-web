<template>
  <IndexPage
    entity="standardized_courses"
    :search-fields="searchFields"
    :component="StandardizedCourses"
  />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { controls } from '~/components/Form';
import IndexPage from '~/components/database/pages/index/IndexPage.vue';
import { dbFields } from '~/components/database/fields';
import StandardizedCourses from '~/components/database/records/standardized_courses/StandardizedCoursesListing.vue';

@Component({
  components: { IndexPage },
})
export default class extends DatabasePage {
  searchFields = [
    [ 'search', controls.text ],
    [ 'education_level', dbFields.selectBRecord, { entity: 'education_levels' } ],
  ]

  StandardizedCourses = StandardizedCourses;
}
</script>
