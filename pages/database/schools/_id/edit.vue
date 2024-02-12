<script lang="ts">
import { Component } from 'vue-property-decorator';
import CountryDBPage from '~/components/database/pages/CountryDBPage.vue';
import EditRecordCard from '~/components/views/application/pages/EditRecordCard.vue';
import ApplicationPage from '~/components/views/application/ApplicationPage.vue';
import EditSchoolFields from '~/components/views/school/EditSchoolFields.vue';
import EntityCardHeader from '~/components/database/pages/shared/EntityCardHeader.vue';
import RecordErrors from '~/components/database/RecordErrors.vue';
import app from '~/lib/app';
import { wai } from '~/vendor/wai';
import { school } from '~/lib/records';

@Component({
  components: {
    CountryDBPage,
    RecordErrors,
    EntityCardHeader,
    EditSchoolFields,
    ApplicationPage,
    EditRecordCard,
  },
})
export default class Edit extends CountryDBPage.ComponentBase {
  page = app.page.emptyState();
  saveable = app.page.saveableState(this);
  school = app.nullable<school.V3_School>();

  async onConnect () {
    const record_id = this.$route.params.id || '-1';

    const { response, okPayload } = await this.$api2.V3_request({
      path: '/schools',
      params: {
        id: record_id,
        per_page: 1,
        slices: [ 'record' ],
      },
      reducer: value => wai.recordShow(value, school.V3_parseRecord),
    });

    const errors = app.api.showErrors(response, [ 'record' ]);
    if (errors?.[0] || !okPayload?.record) {
      this.page.hasFailed = `app.processing.${errors?.[0]?.[1] ?? 'not_found'}`;
      return;
    }

    this.school = okPayload.record;
    this.page.hasConnected = true;
  }

  async onSave () {
    if (!this.school) return;
    const record = this.saveable.getRecordParams?.();

    const { response, okPayload } = await this.$api2.V3_request({
      path: `/schools/${this.school.id}/update`,
      params: { record },
      reducer: wai.recordUpdate,
    });

    this.saveable.errors = app.api.updateErrors(response);
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
    <ApplicationPage
      :state="page"
      :auto-connect="false"
      @connect="onConnect"
    >
      <EditRecordCard
        :active="page.hasConnected"
        :transaction="saveable.transaction"
      >
        <template #header>
          <EntityCardHeader
            :record="school ?? undefined"
            :path="`/database/schools/${school?.id}`"
          >
            <t value="page.schools.new.title" />
          </EntityCardHeader>
        </template>
        <template v-if="saveable.errors" #errors>
          <RecordErrors entity="schools" :errors="saveable.errors" />
        </template>
        <EditSchoolFields :saveable="saveable" :record="school?.record" />
      </EditRecordCard>
    </ApplicationPage>
  </CountryDBPage>
</template>
