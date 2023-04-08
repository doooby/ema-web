<template>
  <index3-page
    entity="people"
    :search-fields="searchFields"
    :actions="actions"
  />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import { controls } from '~/components/Form';
import { dbFields } from '~/components/database/fields';
import Index3Page from '~/components/database/pages/index/Index3Page.vue';

@Component({
  components: { Index3Page },
})
export default class extends DatabasePage {
  searchFields = [
    [ 'search', controls.text ],
    [ 'kobo_id', controls.text ],
    [ 'school_year', dbFields.selectBRecord, { entity: 'school_years' } ],
    [ 'group_id', 'text' ],
    [ 'course_id', 'text' ],
    [ 'school', dbFields.selectBRecord, { entity: 'schools' } ],
  ]

  actions = [
    { action: 'edit', icon: 'pencil', t: 'db.page.edit.action' },
  ];
}
</script>
