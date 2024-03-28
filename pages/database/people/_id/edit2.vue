<script lang="ts">
import { Component } from 'vue-property-decorator';
import CountryDBPage from '~/components/database/pages/CountryDBPage.vue';
import EntityCardHeader from '~/components/database/pages/shared/EntityCardHeader.vue';
import EditRecordCard from '~/components/views/application/pages/EditRecordCard.vue';
import EditPersonFields from '~/components/views/person/EditPersonFields.vue';
import app from '~/lib/app';
import { person } from '~/lib/records';
import { wai } from '~/vendor/wai';
import RecordErrors from '~/components/database/RecordErrors.vue';

@Component({
  components: {
    CountryDBPage,
    EditRecordCard,
    EntityCardHeader,
    EditPersonFields,
    RecordErrors,
  },
})
export default class Edit2 extends CountryDBPage.ComponentBase {
  pageState: app.page.State = { isLoading: true };
  person = app.nullable<wai.AResource<{
    record: ReturnType<typeof person.parseRecordSlice>;
  }>>();
  record = app.page.useSaveableRecord(this);

  async created () {
    const personId = this.$route.params.id || '-1';
    const fetchedPerson = await app.api.fetchRecord(
      this.$api2, '/people', personId, [ 'record' ], value => ({
        record: wai.property(value, 'record', person.parseRecordSlice),
      }),
    );
    if (!fetchedPerson.success) {
      this.pageState.errorMessage = fetchedPerson.errorMessage;
    } else {
      this.person = fetchedPerson.record;
    }
    this.pageState.isLoading = false;
  }

  async onSave () {
    if (!this.person?.id || !this.record.changeParams) return;
    const { success, recordId } = await app.api.createRecord(
      this.$api2, this.record, `/people/${this.person.id}/update`,
    );
    if (success) {
      await this.$router.push({
        path: `/database/people/${recordId}`,
      });
    }
  }
}
</script>

<template>
  <CountryDBPage>
    <div class="container pt-4 pb-5">
      <EditRecordCard
        :page-state="pageState"
        :transaction="record.transaction"
      >
        <template #header>
          <EntityCardHeader>
            <t value="page.people.new.title" />
          </EntityCardHeader>
        </template>
        <template v-if="record.errors" #errors>
          <RecordErrors entity="people" :errors="record.errors" />
        </template>
        <EditPersonFields
          :page-state="pageState"
          :person="person?.record"
          :transaction="record.transaction"
          @change="record.changeParams = $event"
        />
      </EditRecordCard>
    </div>
  </CountryDBPage>
</template>
