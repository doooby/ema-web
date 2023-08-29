<script lang="ts">
import { DatabasePage } from '~/components';
import { Component } from 'vue-property-decorator';
import ShowPageTableRow from '~/components/database/ShowPageTableRow.vue';
import ShowPageAction from '~/components/database/ShowPageAction.vue';
import BRecordLink from '~/components/database/components/BRecordLink.vue';
import Show2Page from '~/components/database/pages/show/Show2Page.vue';

@Component({
  components: {
    BRecordLink,
    Show2Page,
    ShowPageAction,
    ShowPageTableRow,
  },
})
export default class extends DatabasePage {}
</script>

<template>
  <show2-page
    entity="standardized_courses"
  >
    <template #title="{ record }">
      {{ record.name_en }}
    </template>

    <template #actions="{ record }">
      <ul>
        <li v-if="$admission.can('standardized_courses.update')">
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
        <show-page-table-row label="db.record.courses.label.education_level">
          <b-record-link entity="education_levels" :record="record.education_level" />
        </show-page-table-row>
      </table>
    </template>
  </show2-page>
</template>
