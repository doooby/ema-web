<template>
  <IndexPage
    entity="people"
    :search-fields="searchFields"
    :actions="actions"
    :component="People"
  />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { controls } from '~/components/Form';
import { dbFields } from '~/components/database/fields';
import IndexPage from '~/components/database/pages/index/IndexPage.vue';
import People from '~/components/database/records/people/RecordsListing.vue';

@Component({
  components: { IndexPage },
})
export default class extends DatabasePage {
  searchFields = [
    [ 'search', controls.text ],
    [ 'school_year', dbFields.selectBRecord, { entity: 'school_years' } ],
    [ 'group', dbFields.selectBRecord, { entity: 'groups' } ],
    [ 'course', dbFields.selectBRecord, { entity: 'courses' } ],
    [ 'school', dbFields.selectBRecord, { entity: 'schools' } ],
  ]

  People = People;

  actions = [
    { action: 'edit', icon: 'pencil', t: 'db.page.edit.action' },
  ];
}
</script>
