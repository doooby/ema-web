<script lang="ts">
import { Component } from 'vue-property-decorator';
import CountryDBPage from '~/components/database/pages/CountryDBPage.vue';
import ShowPage3 from '~/components/database/pages/show/ShowPage3.vue';
import CourseShow from '~/components/database/records/courses/CourseShow.vue';

@Component({
  components: { CourseShow, ShowPage3, CountryDBPage },
})
export default class Show extends CountryDBPage.Base {

}
</script>

<template>
  <CountryDBPage>
    <ShowPage3 v-slot="{ loader }" entity="courses">
      <CourseShow :course-loader="loader" />
    </ShowPage3>
  </CountryDBPage>
</template>
