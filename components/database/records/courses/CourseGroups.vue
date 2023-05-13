<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { course } from '~/lib/records';
import RecordsListing from '~/components/database/records/groups/RecordsListing.vue';

@Component({
  components: {
    RecordsListing,
  },
})
export default class CourseGroups extends Vue {
  @Prop({ required: true }) readonly course!: course.Course;

  searchParams = {
    course_id: this.course.id,
  };

  initialColumns = []
}
</script>

<template>
  <div class="mt-3">
    <records-listing
      class="mt-2"
      :initial-columns="initialColumns"
      :params="searchParams"
      :hide-school="true"
      :hide-course="true"
    />
  </div>
</template>
