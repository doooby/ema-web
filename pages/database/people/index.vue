<template>
  <IndexPage
    entity="people"
    :search-fields="searchFields"
    :component="PeopleListing"
  />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { controls } from '~/components/Form';
import { dbFields } from '~/components/database/fields';
import IndexPage from '~/components/database/pages/index/IndexPage.vue';
import PeopleListing from '~/components/database/records/people/PeopleListing.vue';

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

  PeopleListing = PeopleListing;
}
</script>
