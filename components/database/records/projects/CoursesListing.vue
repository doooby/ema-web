<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { project } from '~/lib/records';
import RecordsListing from '~/components/database/records/courses/RecordsListing.vue';

@Component({
  components: {
    RecordsListing,
  },
})
export default class CoursesListing extends Vue {
  @Prop({ required: true }) readonly project!: project.Project;

  searchParams = {
    project_id: this.project.id,
  };
}
</script>

<template>
  <div class="mt-3">
    <records-listing
      class="mt-2"
      :params="searchParams"
      :hide-school="true"
    />
  </div>
</template>
