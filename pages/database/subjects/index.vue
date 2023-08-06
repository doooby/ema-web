<template>
  <IndexPage
    entity="subjects"
    :search-fields="searchFields"
    :component="component"
  />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { controls } from '~/components/Form';
import IndexPage from '~/components/database/pages/index/IndexPage.vue';
import RecordsListing from '~/components/database/records/subjects/SubjectsListing.vue';

@Component({
  components: { IndexPage },
})
export default class extends DatabasePage {
  component=RecordsListing;

  searchFields =[
    [ 'search', controls.text ],
  ];
}
</script>
