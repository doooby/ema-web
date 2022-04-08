<template>
  <show-page
    entity="course_guidelines"
  >
    <template #title="{ record }">
      {{ record.name_en }}
    </template>

    <template #actions="{ record }">
      <ul>
        <li>
          <show-page-action
            icon="pencil"
            :path="`/database/course_guidelines/${record.id}/edit`"
          >
            <t value="db.page.edit.action" />
          </show-page-action>
        </li>
      </ul>
    </template>

    <template #details="{ record }">
      <table class="table">
        <show-page-table-row label="db.record.course_guidelines.label.name">
          {{ record.name_en }}
          <br>
          <small>{{ record.name }}</small>
        </show-page-table-row>
        <show-page-table-row label="db.record.course_guidelines.label.education_level">
          {{ record.education_level.labels.caption }}
        </show-page-table-row>
      </table>
    </template>

    <template #container="{ record }">
      <course-settings :course-guideline="record" />
    </template>
  </show-page>
</template>

<script lang="ts">
import ShowPage from '~/components/database/ShowPage.vue';
import { DatabasePage } from '~/components';
import { Component } from 'vue-property-decorator';
import ShowPageTableRow from '~/components/database/ShowPageTableRow.vue';
import ShowPageAction from '~/components/database/ShowPageAction.vue';
import CourseSettings from '~/components/database/records/course_guidelines/CourseSettings/index.vue';

@Component({
  components: {
    ShowPage,
    ShowPageAction,
    ShowPageTableRow,
    CourseSettings,
  },
})
export default class extends DatabasePage {}
</script>
