<template>
  <IndexPage
    entity="subject_categories"
    :search-fields="searchFields"
    :component="SubjectCategories"
  />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import IndexPage from '~/components/database/pages/index/IndexPage.vue';
import { controls } from '~/components/Form';
import SubjectCategories from '~/components/database/records/subject_categories/SubjectCategoriesListing.vue';

@Component({
  components: { IndexPage },
})
export default class extends DatabasePage {
  searchFields = [
    [ 'search', controls.text ],
  ];

  SubjectCategories = SubjectCategories;
}
</script>
