<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { course } from '~/lib/records';
import RecordsListing from '~/components/database/records/subjects/SubjectsListing.vue';

@Component({
  components: {
    RecordsListing,
  },
})
export default class SubjectsListing extends Vue {
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
      :hide-education-level="true"
    />
  </div>
</template>
