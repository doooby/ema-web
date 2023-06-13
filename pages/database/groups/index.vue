<template>
  <IndexPage
    entity="groups"
    :search-fields="searchFields"
    :actions="actions"
    :component="GroupsListing"
  />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { controls } from '~/components/Form';
import { dbFields } from '~/components/database/fields';
import IndexPage from '~/components/database/pages/index/IndexPage.vue';
import GroupsListing from '~/components/database/records/groups/RecordsListing.vue';

@Component({
  components: { IndexPage },
})
export default class extends DatabasePage {
  searchFields= [
    [ 'search', controls.text ],
    [ 'school', dbFields.selectBRecord, { entity: 'schools' } ],
    [ 'course', dbFields.selectBRecord, { entity: 'courses' } ],
  ];

GroupsListing = GroupsListing;

  actions = [
    { action: 'edit', icon: 'pencil', t: 'db.page.edit.action' },
  ];
}
</script>
