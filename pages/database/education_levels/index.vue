<template>
  <IndexPage
    entity="education_levels"
    :search-fields="searchFields"
    :component="EducationLevels"
  />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { controls } from '~/components/Form';
import IndexPage from '~/components/database/pages/index/IndexPage.vue';
import EducationLevels from '~/components/database/records/education_levels/EducationLevelsListing.vue';

@Component({
  components: { IndexPage },
})
export default class extends DatabasePage {
  searchFields = [
    [ 'search', controls.text ],
  ]

EducationLevels = EducationLevels;
}
</script>
