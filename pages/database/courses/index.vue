<template>
  <IndexPage
    entity="courses"
    :search-fields="searchFields"
    :actions="actions"
  />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { controls } from '~/components/Form';
import IndexPage from '~/components/database/pages/index/IndexPage.vue';
import { dbFields } from '~/components/database/fields';

@Component({
  components: { IndexPage },
})
export default class extends DatabasePage {
  searchFields = [
    [ 'search', controls.text ],
    [ 'school', dbFields.selectBRecord, { entity: 'schools' } ],
    [ 'project', dbFields.selectBRecord, { entity: 'projects' } ],
    [ 'education_level', dbFields.selectBRecord, { entity: 'education_levels' } ],
  ]

  actions = [
    { action: 'edit', icon: 'pencil', t: 'db.page.edit.action' },
  ];
}
</script>
