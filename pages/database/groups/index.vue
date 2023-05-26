<template>
  <IndexPage
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
import IndexPage from '~/components/database/pages/index/IndexPage.vue';

@Component({
  components: { IndexPage },
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
