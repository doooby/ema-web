<script lang="ts">
import { Component } from 'vue-property-decorator';
import app from '~/lib/app';
import CountryDBPage from '~/components/database/pages/CountryDBPage.vue';
import EditRecordCard from '~/components/views/application/pages/EditRecordCard.vue';
import EntityCardHeader from '~/components/database/pages/shared/EntityCardHeader.vue';
import RecordErrors from '~/components/database/RecordErrors.vue';
import EditPersonFields from '~/components/views/person/EditPersonFields.vue';
import AddToCourseFields from '~/components/views/student/fields/AddToCourseFields.vue';

@Component({
  components: {
    EditPersonFields,
    RecordErrors,
    EntityCardHeader,
    EditRecordCard,
    CountryDBPage,
    AddToCourseFields,
  },
})
export default class extends CountryDBPage.ComponentBase {
  pageState: app.page.State = { isLoading: false };

  record = app.page.useSaveableRecord(this);

  moveToCourseParams: app.api.Params = {};

  async onSave () {
    if (!this.record.changeParams) return;
    const { success, recordId } = await app.api.createRecord(
      this.$api2, this.record, '/students/create',
      { course: this.moveToCourseParams },
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
            <t value="page.students.new.title" />
          </EntityCardHeader>
        </template>
        <template v-if="record.errors" #errors>
          <RecordErrors entity="people" :errors="record.errors" />
        </template>
        <div class="row">
          <div class="col">
            <h3>
              <t value="db.pages.people.new.move_to_course.title" />
            </h3>
            <div class="col-md-6">
              <AddToCourseFields
                v-model="moveToCourseParams"
                :page-state="pageState"
                :transaction="record.transaction"
              />
            </div>
          </div>
        </div>
        <EditPersonFields
          :page-state="pageState"
          :transaction="record.transaction"
          @change="record.changeParams = $event"
        />
      </EditRecordCard>
    </div>
  </CountryDBPage>
</template>
