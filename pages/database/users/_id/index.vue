<template>
  <show-page
    entity="users"
  >
    <template #title="{ record }">
      {{ record.full_name_en }} - {{ record.login }}
    </template>

    <template #actions="{ record, reloadRecord }">
      <ul>
        <li>
          <show-page-action
            icon="pencil"
            :path="`/database/users/${record.id}/edit`"
          >
            <t value="db.pages.users.edit" />
          </show-page-action>
        </li>
        <li>
          <show-page-action
            icon="lock"
            @click="changePassModalShown = true"
          >
            <t value="db.pages.users.change_pass" />
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
            <t :value="`db.pages.users.${record.lock ? 'un' : ''}lock`" />
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
        <show-page-table-row label="name">
          {{ record.full_name_en }}, {{ record.full_name }}
        </show-page-table-row>
        <show-page-table-row label="country">
          {{ record.country && record.country.caption }}
        </show-page-table-row>
        <show-page-table-row label="privileges">
          is_root: {{ record.is_root ? 'Yes': 'No' }} <br>
          is_can_admin: {{ record.is_can_admin ? 'Yes': 'No' }} <br>
          is_can_web: {{ record.is_can_web ? 'Yes': 'No' }} <br>
          is_can_mng_users: {{ record.is_can_mng_users ? 'Yes': 'No' }} <br>
        </show-page-table-row>
      </table>
    </template>
  </show-page>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import DatabasePageMixin from '~/components/mixins/DatabasePageMixin';
import ShowPage from '~/components/database/ShowPage.vue';
import ChangePasswordModal from '~/components/database/pages/users/ChangePasswordModal.vue';
import LockModal from '~/components/database/pages/users/LockModal.vue';
import ShowPageAction from '~/components/database/ShowPageAction.vue';
import ShowPageTableRow from '~/components/database/ShowPageTableRow.vue';

@Component({
  components: {
    ShowPage,
    ShowPageAction,
    ShowPageTableRow,
    ChangePasswordModal,
    LockModal,
  },
})
export default class extends DatabasePageMixin {
  changePassModalShown = false;
  lockModalShown = false;
}
</script>
