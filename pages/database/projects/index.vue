<template>
  <IndexPage
    entity="projects"
    :search-fields="searchFields"
    :component="ProjectsListing"
  />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { controls } from '~/components/Form';
import IndexPage from '~/components/database/pages/index/IndexPage.vue';
import ProjectsListing from '~/components/database/records/projects/ProjectsListing.vue';

@Component({
  components: { IndexPage },
})
export default class extends DatabasePage {
  searchFields = [
    [ 'search', controls.text ],
  ];

  ProjectsListing = ProjectsListing;
}
</script>
