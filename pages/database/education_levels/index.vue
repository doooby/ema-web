<template>
  <index-page
    entity="education_levels"
    :search-fields="searchFields"
    :table-columns="tableColumns"
  />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import IndexPage from '~/components/database/page/index/IndexPage.vue';
import { FormFieldDefinition } from '~/components/Form';

@Component({
  components: { IndexPage },
})
export default class extends DatabasePage {
  get searchFields (): FormFieldDefinition[] {
    return [
      [ 'country', 'hidden', { value: this.currentCountryId } ],
    ];
  }

  tableColumns = [
    { name: 'id', cell: { type: 'link', onlyId: true }, size: 60 },
    { name: 'name' },
    { name: 'level' },
    { name: 'terms_per_year' },
    { name: 'start_age' },
    { name: 'years_length' },
    { name: 'mandatory' },
  ];
}
</script>
