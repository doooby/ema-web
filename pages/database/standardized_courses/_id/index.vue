<template>
  <show-page
    entity="standardized_courses"
  >
    <template #title="{ record }">
      {{ record.name_en }}
    </template>

    <template #actions="{ record }">
      <ul>
        <li>
          <show-page-action
            icon="pencil"
            :path="`/database/standardized_courses/${record.id}/edit`"
          >
            <t value="db.page.edit.action" />
          </show-page-action>
        </li>
      </ul>
    </template>

    <template #details="{ record }">
      <table class="table">
        <show-page-table-row label="db.record.standardized_courses.label.name">
          {{ record.name_en }}
          <br>
          <small>{{ record.name }}</small>
        </show-page-table-row>
        <show-page-table-row label="db.record.standardized_courses.label.education_level">
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
import ShowPageAction from '~/components/database/ShowPageAction.vue';

@Component({
  components: {
    ShowPage,
    ShowPageAction,
    ShowPageTableRow,
  },
})
export default class extends DatabasePage {}
</script>
