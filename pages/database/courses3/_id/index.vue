<script lang="ts">
import { Component } from 'vue-property-decorator';
import CountryDBPage from '~/components/database/pages/CountryDBPage.vue';
import ShowPage3 from '~/components/database/pages/show/ShowPage3.vue';
import CourseShow from '~/components/database/records/courses/CourseShow.vue';
import { course } from '~/lib/records';

@Component({
  components: { CourseShow, ShowPage3, CountryDBPage },
})
export default class Show extends CountryDBPage.ComponentBase {
  entity = course.entity;
  reducer = course.parseRecord;
}
</script>

<template>
  <CountryDBPage>
    <ShowPage3
      v-slot="{ loader }"
      :entity="entity"
      :slices="[ 'record' ]"
      :reducer="reducer"
    >
      <CourseShow :record-loader="loader" />
    </ShowPage3>
  </CountryDBPage>
</template>
