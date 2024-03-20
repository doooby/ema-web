<script lang="ts">
import { Component } from 'vue-property-decorator';
import app from '~/lib/app';
import CountryDBPage from '~/components/database/pages/CountryDBPage.vue';
import EditRecordCard from '~/components/views/application/pages/EditRecordCard.vue';
import EntityCardHeader from '~/components/database/pages/shared/EntityCardHeader.vue';
import RecordErrors from '~/components/database/RecordErrors.vue';
import EditPersonFields from '~/components/views/person/EditPersonFields.vue';

@Component({
  components: { EditPersonFields, RecordErrors, EntityCardHeader, EditRecordCard, CountryDBPage },
})
export default class New2 extends CountryDBPage.ComponentBase {
  pageState: app.page.State = { isLoading: false };

  record = app.page.useSaveableRecord(this);

  onSave () {
    // if (!this.record.changeParams) return;
    this.record.transaction.state.isProcessing = true;
    this.record.errors = undefined;
    setTimeout(
      () => {
        this.record.transaction.state.isProcessing = false;
        this.record.errors = [
          [ undefined, 'MY_BAD' ],
        ];
      },
      2000,
    );
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
          @change="record.changeParams = $event"
        />
      </EditRecordCard>
    </div>
  </CountryDBPage>
</template>
