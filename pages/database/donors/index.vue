<template>
  <IndexPage
    entity="donors"
    :search-fields="searchFields"
    :component="Donors"
  />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { controls } from '~/components/Form';
import IndexPage from '~/components/database/pages/index/IndexPage.vue';
import Donors from '~/components/database/records/donors/DonorsListing.vue';

@Component({
  components: { IndexPage },
})
export default class extends DatabasePage {
  searchFields = [
    [ 'search', controls.text ],
  ]

  Donors = Donors;
}
</script>
