<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { course } from '~/lib/records';
import GroupsListing from '~/components/database/records/groups/GroupsListing.vue';

@Component({
  components: {
    GroupsListing,
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
    <GroupsListing
      class="mt-2"
      :initial-columns="initialColumns"
      :params="searchParams"
      :hide-course="true"
      :hide-school-year="true"
    />
  </div>
</template>
