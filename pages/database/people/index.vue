<template>
  <IndexPage
    entity="people"
    :search-fields="searchFields"
    :component="PeopleListing"
  >
    <template #group-actions="{ records }">
      <MoveStudents :students="records" />
    </template>
  </IndexPage>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { asFieldType, controls } from '~/components/Form';
import { dbFields } from '~/components/database/fields';
import IndexPage from '~/components/database/pages/index/IndexPage.vue';
import PeopleListing from '~/components/database/records/people/PeopleListing.vue';
import MoveStudents from '~/components/database/records/groups/students/actions/MoveStudents.vue';
import AttendedCourse from '~/components/database/records/people/filterFields/AttendedCourse.vue';

@Component({
  components: {
    MoveStudents,
    IndexPage,
  },
})
export default class extends DatabasePage {
  searchFields = [
    [ 'search', controls.text ],
    [ 'school_year', dbFields.selectBRecord, { entity: 'school_years' } ],
    [ 'group', dbFields.selectBRecord, { entity: 'groups' } ],
    [ 'course', dbFields.selectBRecord, { entity: 'courses' } ],
    [ 'school', dbFields.selectBRecord, { entity: 'schools' } ],
    [ 'attended_course', asFieldType(AttendedCourse) ],
  ]

  PeopleListing = PeopleListing;
}
</script>
