<template>
  <show-page
    entity="people"
  >
    <template #title="{ record }">
      {{ record.name_en }}
    </template>

    <template #actions="{ record }">
      <ul>
        <li>
          <show-page-action
            icon="pencil"
            :path="`/database/people/${record.id}/edit`"
          >
            <t value="db.page.edit.action" />
          </show-page-action>
        </li>
      </ul>
    </template>

    <template #details="{ record }">
      <table class="table">
        <show-page-table-row label="db.record.people.label.family_name">
          {{ record.family_name_en }}
          <br>
          <small>{{ record.family_name }}</small>
        </show-page-table-row>
        <show-page-table-row label="db.record.people.label.given_name">
          {{ record.given_name_en }}
          <br>
          <small>{{ record.given_name }}</small>
        </show-page-table-row>
        <show-page-table-row label="db.record.people.label.born_on">
          {{ $d(record.born_on) }}
        </show-page-table-row>
      </table>
    </template>
  </show-page>
</template>

<script lang="ts">
import ShowPage from '~/components/database/ShowPage.vue';
import { Component } from 'vue-property-decorator';
import ShowPageAction from '~/components/database/ShowPageAction.vue';
import ShowPageTableRow from '~/components/database/ShowPageTableRow.vue';
import { DatabasePage } from '~/components';

@Component({
  components: {
    ShowPage,
    ShowPageAction,
    ShowPageTableRow,
  },
})
export default class extends DatabasePage {}
</script>
