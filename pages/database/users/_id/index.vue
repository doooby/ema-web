<template>
  <show-page
    entity="users"
    :record-id="recordId"
    :title="title"
  >
    <template #detail="{ record }">
      <div class="emb-6">
        <record-detail-value label="Name">
          {{ record.full_name_en }}, {{ record.full_name }}
        </record-detail-value>
        <record-detail-value label="country">
          {{ record.country.caption }}
        </record-detail-value>
        <record-detail-value label="password">
          <b-button @click="changePassModalShown = true">
            {{ $t('db.pages.change_pass') }}
          </b-button>
          <change-password-modal
            v-model="changePassModalShown"
            :record="record"
          />
        </record-detail-value>
      </div>
    </template>
  </show-page>
</template>

<script lang="ts">
import Vue from 'vue';
import ShowPage from '~/components/database/ShowPage.vue';
import RecordDetailValue from '~/components/database/RecordDetailValue.vue';
import ChangePasswordModal from '~/components/database/pages/users/ChangePasswordModal';

export default Vue.extend({
  components: { ShowPage, RecordDetailValue, ChangePasswordModal },
  layout: 'database',
  data () {
    return {
      recordId: Number(this.$route.params.id),
      title: {
        text: (record: any) => `${record.full_name_en} - ${record.login}`,
        showEditLink: true,
      },
      changePassModalShown: false,
    };
  },
  methods: {
    formatDate: utils.formatDate,
  },
});
</script>
