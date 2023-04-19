<template>
  <index4-page
    entity="courses"
    :search-fields="searchFields"
    :actions="actions"
  />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { controls } from '~/components/Form';
import Index4Page from '~/components/database/pages/index/index4Page.vue';
import { dbFields } from '~/components/database/fields';

@Component({
  components: { Index4Page },
})
export default class extends DatabasePage {
  searchFields = [
    [ 'search', controls.text ],
    [ 'school_id', dbFields.selectBRecord, { entity: 'schools' } ],
    [ 'education_level_id', dbFields.selectBRecord, { entity: 'education_levels' } ],
  ]

  actions = [
    { action: 'edit', icon: 'pencil', t: 'db.page.edit.action' },
  ];
}
</script>
