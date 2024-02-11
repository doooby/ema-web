<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import CountryDBPage from '~/components/database/pages/CountryDBPage.vue';
import ApplicationPage from '~/components/views/application/ApplicationPage.vue';
import app from '~/lib/app';
import EditRecordCard from '~/components/views/application/pages/EditRecordCard.vue';
import EntityCardHeader from '~/components/database/pages/shared/EntityCardHeader.vue';
import RecordErrors from '~/components/database/RecordErrors.vue';
import EditSchoolFields from '~/components/views/school/EditSchoolFields.vue';
import { wai } from '~/vendor/wai';

@Component({
  components: { EditSchoolFields, RecordErrors, EntityCardHeader, EditRecordCard, CountryDBPage, ApplicationPage },
})
export default class New extends CountryDBPage.ComponentBase {
  page = app.page.emptyState();
  saveable = app.page.saveableState({
    context: this,
    onSave: () => this.onSave(),
  })

  async onSave () {
    const record = this.saveable.getRecordParams?.();

    const { response, okPayload } = await this.$api2.V3_request({
      path: '/schools/create',
      params: { record },
      reducer: wai.recordUpdate,
    });

    this.saveable.errors = app.api.createErrors(response);
    if (this.saveable.errors) {
      this.saveable.transaction.state.isProcessing = false;
      return;
    }

    await this.$router.push({
      path: `/database/schools/${okPayload?.record_id}`,
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
            <t value="page.schools.new.title" />
          </EntityCardHeader>
        </template>
        <template v-if="saveable.errors" #errors>
          <RecordErrors entity="schools" :errors="saveable.errors" />
        </template>
        <EditSchoolFields :saveable="saveable" />
      </EditRecordCard>
    </ApplicationPage>
  </CountryDBPage>
</template>
