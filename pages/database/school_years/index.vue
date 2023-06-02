<template>
  <IndexPage
    entity="school_years"
    :search-fields="searchFields"
    :actions="actions"
    :component="SchoolYears"
  />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { controls } from '~/components/Form';
import IndexPage from '~/components/database/pages/index/IndexPage.vue';
import SchoolYears from '~/components/database/records/school_years/RecordsListing.vue';

@Component({
  components: { IndexPage },
})
export default class extends DatabasePage {
  searchFields = [
    [ 'search', controls.text ],
  ];

  SchoolYears = SchoolYears;
  actions = [
    { action: 'edit', icon: 'pencil', t: 'db.page.edit.action' },
  ];
}
</script>
