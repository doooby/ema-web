<template>
  <IndexPage
    entity="material_kits"
    :search-fields="searchFields"
    :component="MaterialKits"
  />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { controls } from '~/components/Form';
import IndexPage from '~/components/database/pages/index/IndexPage.vue';
import MaterialKits from '~/components/database/records/material_kits/MaterialKitsListing.vue';

@Component({
  components: { IndexPage },
})
export default class extends DatabasePage {
  searchFields = [
    [ 'search', controls.text ],
  ]

MaterialKits = MaterialKits;
}
</script>
