<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { project } from '~/lib/records';
import SchoolsListing from '~/components/database/records/schools/SchoolsListing.vue';

@Component({
  components: {
    SchoolsListing,
  },
})
export default class ProjectSchoolsListing extends Vue {
  @Prop({ required: true }) readonly project!: project.Project;

  searchParams = {
    project_id: this.project.id,
  };
}
</script>

<template>
  <div class="mt-3">
    <SchoolsListing
      class="mt-2"
      :params="searchParams"
      :hide-projects="true"
    />
  </div>
</template>
