<template>
  <browse-page
    entity="students"
    :search-fields="searchFields"
    :table-columns="tableColumns"
  >
    <template #actions="{ dataItem }">
      <record-actions-cell
        entity="students"
        :record="dataItem"
        :edit="true"
      />
    </template>
  </browse-page>
</template>

<script lang="ts">
import Vue from 'vue';
import { formatISO } from 'date-fns';
import BrowsePage from '~/components/database/BrowsePage.vue';
import { Student } from '~/lib/records';
import RecordActionsCell from '~/components/database/RecordActionsCell.vue';

export default Vue.extend({
  components: { RecordActionsCell, BrowsePage },
  layout: 'database',
  data () {
    return {
      searchFields: [
        { name: 'name', control: 'text' },
      ],
      tableColumns: [
        { name: 'actions', slot: 'actions', headerText: false, size: 40 },
        { name: 'id', cell: { type: 'link', entity: 'students' }, size: 60 },
        { name: 'first_name_en' },
        { name: 'last_name_en' },
        { name: 'first_name' },
        { name: 'last_name' },
        { name: 'born_at', getText: (student: Student) => formatISO(student.born_at, { representation: 'date' }) },
        { name: 'gender', getText: (student: Student) => this.translateGender(student.gender) },
        { name: 'language' },
      ],
    };
  },
  methods: {
    translateGender (gender: string) {
      switch (gender) {
        case 'f': return this.$t('gender.f');
        case 'm': return this.$t('gender.m');
        default: return this.$t('gender.other');
      }
    },
  },
});
</script>
