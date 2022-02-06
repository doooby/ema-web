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
      [ 'country_id', 'hidden', { value: this.currentCountryId } ],
    ];
  }

  tableColumns = [
    { name: 'id', cell: { type: 'link', onlyId: true }, size: 60 },
    { name: 'name_en' },
    { name: 'name' },
    { name: 'level' },
  ];
}
</script>
