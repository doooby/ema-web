<template>
  <index3-page
    entity="education_levels"
    :search-fields="searchFields"
    :actions="actions"
  />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import Index3Page from '~/components/database/pages/index/Index3Page.vue';
import { controls } from '~/components/Form';

@Component({
  components: {
    Index3Page,
  },
})
export default class extends DatabasePage {
  searchFields = [
    [ 'search', controls.text ],
  ]

  actions = [
    { action: 'edit', icon: 'pencil', t: 'db.page.edit.action' },
  ];
}
</script>
