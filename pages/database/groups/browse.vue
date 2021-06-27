<template>
  <browse-page
    entity="groups"
    :search-fields="searchFields"
    :table-columns="tableColumns"
    :record-actions="recordActions"
  >
    <template #school="{ row }">
      <show-record-link entity="schools" :record-id="row.item.school.id">
        {{ row.item.school.name }}
      </show-record-link>
    </template>
  </browse-page>
</template>

<script lang="ts">
import Vue from 'vue';
import BrowsePage from '~/components/database/BrowsePage.vue';
import ShowRecordLink from '~/components/database/ShowRecordLink.vue';

export default Vue.extend({
  components: { BrowsePage, ShowRecordLink },
  layout: 'database',
  data () {
    return {
      searchFields: [
        { name: 'name', controlType: 'text' },
      ],
      tableColumns: [
        { name: 'id' },
        { name: 'name' },
        { name: 'year' },
        {
          name: 'course',
          // cell: {
          //   type: 'assoc',
          //   entity: 'courses',
          //   text: (course: any) => course.id,
          // },
        },
        { name: 'school', slot: 'school' },
      ],
      recordActions: {
        show: true,
      },
    };
  },
});
</script>
