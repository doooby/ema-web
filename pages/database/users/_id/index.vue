<template>
  <show-page
    entity="users"
  >
    <template #title="{ record }">
      {{ record.full_name_en }} - {{ record.login }}
    </template>
    <template #detail="{ record, reloadRecord }">
      <div class="emb-6">
        <b-alert v-if="record.lock" show variant="info">
          User is locked.
        </b-alert>
        <record-detail-value label="Name">
          {{ record.full_name_en }}, {{ record.full_name }}
        </record-detail-value>
        <record-detail-value label="Country">
          {{ record.country && record.country.caption }}
        </record-detail-value>
        <record-detail-value label="Password">
          <b-button @click="changePassModalShown = true">
            {{ $t('db.pages.users.change_pass') }}
          </b-button>
          <change-password-modal
            v-model="changePassModalShown"
            :record="record"
          />
        </record-detail-value>
        <record-detail-value label="Lock">
          <div v-if="record.lock">
            is locked
          </div>
          <b-button @click="lockModalShown = true">
            {{ $t(`db.pages.users.${record.lock ? 'un' : ''}lock`) }}
          </b-button>
          <lock-modal
            v-model="lockModalShown"
            :record="record"
            @recordChanged="reloadRecord"
          />
        </record-detail-value>
        <record-detail-value label="Is Root">
          {{ record.is_root ? 'Yes': 'No' }}
        </record-detail-value>
      </div>
    </template>
  </show-page>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import DatabasePageMixin from '~/components/mixins/DatabasePageMixin';
import ShowPage from '~/components/database/ShowPage.vue';
import RecordDetailValue from '~/components/database/RecordDetailValue.vue';
import ChangePasswordModal from '~/components/database/pages/users/ChangePasswordModal.vue';
import LockModal from '~/components/database/pages/users/LockModal.vue';

@Component({
  components: { ShowPage, RecordDetailValue, ChangePasswordModal, LockModal },
})
export default class extends DatabasePageMixin {
  changePassModalShown = false;
  lockModalShown = false;
}
</script>
