<template>
  <index4-page
    entity="users"
    :search-fields="searchFields"
    :actions="actions"
  />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { controls } from '~/components/Form';
import Index4Page from '~/components/database/pages/index/index4Page.vue';

@Component({
  components: { Index4Page },
})
export default class extends DatabasePage {
  searchFields = [
    [ 'search', controls.text ],
  ];

  actions = [
    { action: 'edit', icon: 'pencil', t: 'db.page.edit.action' },
  ];
}
</script>
