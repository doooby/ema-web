<script lang="ts">
import { Component } from 'vue-property-decorator';
import app from '~/lib/app';
import CountryDBPage from '~/components/database/pages/CountryDBPage.vue';
import { wai } from '~/vendor/wai';
import ApplicationPage from '~/components/views/application/ApplicationPage.vue';
import RecordErrors from '~/components/database/RecordErrors.vue';
import EntityCardHeader from '~/components/database/pages/shared/EntityCardHeader.vue';
import EditRecordCard from '~/components/views/application/pages/EditRecordCard.vue';
import NewGroupFields from '~/components/views/group/NewGroupFields.vue';

@Component({
  components: {
    CountryDBPage,
    ApplicationPage,
    EditRecordCard,
    EntityCardHeader,
    RecordErrors,
    NewGroupFields,
  },
})
export default class New extends CountryDBPage.ComponentBase {
  page = app.page.emptyState();
  saveable = app.page.saveableState(this);

  async onSave () {
    const record = this.saveable.getRecordParams?.();

    const { response, okPayload } = await this.$api2.V3_request({
      path: '/groups/create',
      params: { record },
      reducer: wai.recordUpdate,
    });

    this.saveable.errors = app.api.createErrors(response);
    if (this.saveable.errors) {
      this.saveable.transaction.state.isProcessing = false;
      return;
    }

    await this.$router.push({
      path: `/database/groups/${okPayload?.record_id}`,
    });
  }
}
</script>

<template>
  <CountryDBPage>
    <ApplicationPage :state="page">
      <EditRecordCard
        :active="page.hasConnected"
        :transaction="saveable.transaction"
      >
        <template #header>
          <EntityCardHeader>
            <t value="page.groups.new.title" />
          </EntityCardHeader>
        </template>
        <template v-if="saveable.errors" #errors>
          <RecordErrors entity="groups" :errors="saveable.errors" />
        </template>
        <NewGroupFields :saveable="saveable" />
      </EditRecordCard>
    </ApplicationPage>
  </CountryDBPage>
</template>
