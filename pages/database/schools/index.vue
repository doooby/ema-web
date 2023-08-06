<template>
  <IndexPage
    entity="schools"
    :search-fields="searchFields"
    :component="Schools"
  />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { controls } from '~/components/Form';
import IndexPage from '~/components/database/pages/index/IndexPage.vue';
import Schools from '~/components/database/records/schools/SchoolsListing.vue';

@Component({
  components: { IndexPage },
})
export default class extends DatabasePage {
  searchFields = [
    [ 'search', controls.text ],
  ]

  Schools = Schools;
}
</script>
