<template>
  <index4-page
    entity="groups"
    :search-fields="searchFields"
    :actions="actions"
  />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { controls } from '~/components/Form';
import { dbFields } from '~/components/database/fields';
import Index4Page from '~/components/database/pages/index/index4Page.vue';

@Component({
  components: { Index4Page },
})
export default class extends DatabasePage {
  searchFields= [
    [ 'search', controls.text ],
    [ 'school', dbFields.selectBRecord, { entity: 'schools' } ],
    [ 'course', dbFields.selectBRecord, { entity: 'courses' } ],
  ];

  actions = [
    { action: 'edit', icon: 'pencil', t: 'db.page.edit.action' },
  ];
}
</script>
