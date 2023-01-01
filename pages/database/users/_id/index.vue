<template>
  <show-page
    entity="users"
  >
    <template #title="{ record }">
      {{ record.full_name[0] }} - {{ record.login }}
    </template>

    <template #actions="{ record, reloadRecord }">
      <ul>
        <li>
          <show-page-action
            icon="pencil"
            :path="`/database/users/${record.id}/edit`"
          >
            <t value="db.page.edit.action" />
          </show-page-action>
        </li>
        <li>
          <show-page-action
            icon="lock"
            @click="changePassModalShown = true"
          >
            <t value="db.record.users.change_pass" />
          </show-page-action>
          <change-password-modal
            v-model="changePassModalShown"
            :record="record"
          />
        </li>
        <li>
          <show-page-action
            icon="lock"
            @click="lockModalShown = true"
          >
            <t :value="`db.record.users.${record.lock ? 'un' : ''}lock`" />
          </show-page-action>
          <lock-modal
            v-model="lockModalShown"
            :record="record"
            @recordChanged="reloadRecord"
          />
        </li>
      </ul>
    </template>

    <template #details="{ record }">
      <b-alert v-if="record.lock" show variant="info">
        User is locked.
      </b-alert>

      <table class="table">
        <show-page-table-row label="db.record.users.label.name">
          {{ record.full_name[0] }}
          <br>
          <small>{{ record.full_name[1] }}</small>
        </show-page-table-row>
        <show-page-table-row label="db.record.users.label.country">
          {{ record.country && record.country.caption }}
        </show-page-table-row>
        <show-page-table-row label="db.record.users.label.privileges">
          <ul>
            <li
              v-for="name of privilegesList(record)"
              :key="name"
            >
              <t :value="`db.record.users.privileges.${name}`" />
            </li>
          </ul>
        </show-page-table-row>
      </table>
    </template>
  </show-page>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import ShowPage from '~/components/database/ShowPage.vue';
import ChangePasswordModal from '~/components/database/records/users/ChangePasswordModal.vue';
import LockModal from '~/components/database/records/users/LockModal.vue';
import ShowPageAction from '~/components/database/ShowPageAction.vue';
import ShowPageTableRow from '~/components/database/ShowPageTableRow.vue';
import { User } from '~/lib/records';

@Component({
  components: {
    ShowPage,
    ShowPageAction,
    ShowPageTableRow,
    ChangePasswordModal,
    LockModal,
  },
})
export default class extends DatabasePage {
  changePassModalShown = false;
  lockModalShown = false;

  privilegesList (record: User): string[] {
    if (record.is_root) return [ 'is_root' ];
    return record.privileges.map(privilege => privilege.type ?? 'null');
  }
}
</script>
