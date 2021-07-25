<template>
  <browse-page
    entity="students"
    :search-fields="searchFields"
    :table-columns="tableColumns"
  >
    <template #actions="{ dataItem }">
      <show-record-link
        entity="students"
        :record-id="dataItem.id"
      >
        {{ dataItem.id }}
      </show-record-link>
      <edit-record-link
        class="eml-3"
        entity="students"
        :record-id="dataItem.id"
      />
    </template>
  </browse-page>
</template>

<script lang="ts">
import Vue from 'vue';
import { formatISO } from 'date-fns';
import BrowsePage from '~/components/database/BrowsePage.vue';
import { Student } from '~/lib/records';
import ShowRecordLink from '~/components/database/ShowRecordLink.vue';
import EditRecordLink from '~/components/database/EditRecordLink.vue';

export default Vue.extend({
  components: { BrowsePage, ShowRecordLink, EditRecordLink },
  layout: 'database',
  data () {
    return {
      searchFields: [
        { name: 'name', control: 'text' },
      ],
      tableColumns: [
        { name: 'id', slot: 'actions' },
        { name: 'first_name_en' },
        { name: 'last_name_en' },
        { name: 'first_name' },
        { name: 'last_name' },
        { name: 'born_at', getText: (student: Student) => formatISO(student.born_at, { representation: 'date' }) },
        { name: 'gender' },
        { name: 'language' },
      ],
    };
  },
});
</script>
