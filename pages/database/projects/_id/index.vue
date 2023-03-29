<template>
  <show2-page
    entity="projects"
  >
    <template #title="{ record }">
      {{ record.name_en }}
    </template>

    <template #actions="{ record }">
      <ul>
        <li>
          <show-page-action
            icon="pencil"
            :path="`/database/projects/${record.id}/edit`"
          >
            <t value="db.page.edit.action" />
          </show-page-action>
        </li>
      </ul>
    </template>

    <template #details="{ record }">
      <table class="table">
        <show-page-table-row label="db.record.projects.label.code">
          {{ record.code }}
        </show-page-table-row>
        <show-page-table-row label="db.record.projects.label.short_name_en">
          {{ record.short_name_en }}
        </show-page-table-row>
        <show-page-table-row label="db.record.projects.label.duration">
          {{ record.starts_on ? $d(record.starts_on) : '' }}
          -
          {{ record.ends_on ? $d(record.ends_on) : '' }}
        </show-page-table-row>
        <show-page-table-row label="db.record.projects.label.donors">
          <div class="d-flex">
            <div
              v-for="donor in (record.donors || [])"
              :key="donor.id"
            >
              <b-record-link entity="donors" :record="donor" />
            </div>
          </div>
        </show-page-table-row>
      </table>
    </template>

    <template #container="{ record }">
      <h3>
        <t value="db.record.projects.label.targets" />
      </h3>
      <h5>
        <t value="db.record.schools.meta.p" />
      </h5>
      <ul>
        <li
          v-for="school in (record.schools || [])"
          :key="school.id"
        >
          <b-record-link entity="schools" :record="school" />
        </li>
      </ul>
    </template>
  </show2-page>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import ShowPageAction from '~/components/database/ShowPageAction.vue';
import ShowPageTableRow from '~/components/database/ShowPageTableRow.vue';
import { DatabasePage } from '~/components';
import Show2Page from '~/components/database/pages/show/Show2Page.vue';
import BRecordLink from '~/components/database/BRecordLink.vue';

@Component({
  components: {
    Show2Page,
    ShowPageAction,
    ShowPageTableRow,
    BRecordLink,
  },
})
export default class extends DatabasePage {}
</script>
