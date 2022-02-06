<template>
  <show-page
    entity="courses"
  >
    <template #title="{ record }">
      {{ record.name_en }}
    </template>

    <template #details="{ record }">
      <table class="table">
        <show-page-table-row label="db.record.courses.label.name">
          {{ record.name_en }}
          <br>
          <small>{{ record.name }}</small>
        </show-page-table-row>
        <show-page-table-row label="db.record.courses.label.grade">
          {{ record.grade }}
        </show-page-table-row>
        <show-page-table-row label="db.record.courses.label.education_level">
          {{ record.education_level.labels.caption }}
        </show-page-table-row>
      </table>
    </template>
  </show-page>
</template>

<script lang="ts">
import ShowPage from '~/components/database/ShowPage.vue';
import { DatabasePage } from '~/components';
import { Component } from 'vue-property-decorator';
import ShowPageTableRow from '~/components/database/ShowPageTableRow.vue';

@Component({
  components: {
    ShowPage,
    ShowPageTableRow,
  },
})
export default class extends DatabasePage {}
</script>
