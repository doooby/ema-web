<template>
  <show2-page
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
          <change-password-modal v-model="changePassModalShown" :record="record" />
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
        <li>
          <show-page-action
            icon="lock"
            @click="archiveModalShown = true"
          >
            <t value="db.components.modals.ConfirmArchiveModal.action" />
          </show-page-action>
          <confirm-archive-modal
            v-model="archiveModalShown"
            entity="users"
            :record-id="record.id"
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

  </show2-page>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import Show2Page from '~/components/database/pages/show/Show2Page.vue';
import ChangePasswordModal from '~/components/database/records/users/ChangePasswordModal.vue';
import LockModal from '~/components/database/records/users/LockModal.vue';
import ShowPageAction from '~/components/database/ShowPageAction.vue';
import ShowPageTableRow from '~/components/database/ShowPageTableRow.vue';
import { user } from '~/lib/records';
import ConfirmArchiveModal from '~/components/database/modals/ConfirmArchiveModal.vue';

@Component({
  components: {
    Show2Page,
    ShowPageAction,
    ShowPageTableRow,
    ChangePasswordModal,
    LockModal,
    ConfirmArchiveModal,
  },
})
export default class extends DatabasePage {
  changePassModalShown = false;
  lockModalShown = false;
  archiveModalShown = false;

  privilegesList (record: user.User) {
    return user.helpers.mapPrivilegeNames(record);
  }
}
</script>
