<script lang="ts">
import { Component } from 'vue-property-decorator';
import app from '~/lib/app';
import EditRecordPage from '~/components/views/application/pages/EditRecordPage.vue';
import { ActionParams } from '~/components/database/pages/ActionPage2.vue';
import { ErrorMessage } from '~/lib/api2';
import { BRecordsSelect, NameInput, IntegerInput } from '~/components/controls/inputs';
import CountryDBPage from '~/components/database/pages/CountryDBPage.vue';
import RecordId from '~/components/views/application/RecordId.vue';
import { wai } from '~/vendor/wai';

@Component({
  components: {
    RecordId,
    CountryDBPage,
    IntegerInput,
    NameInput,
    BRecordsSelect,
    EditRecordPage,
  },
})
export default class New extends CountryDBPage.ComponentBase {
  onCleanAction = app.nullable<() => void>();

  connected = false;

  record: app.Map<any> = {
    course: undefined,
    name: undefined,
    term: undefined,
  };

  saveErrors = app.nullable<ErrorMessage[]>();

  get transaction () {
    return new app.Transaction(
      () => this.onSave(),
      () => this.$router.go(-1),
    );
  }

  onConnect ({ onClean }: ActionParams<never>) {
    this.onCleanAction = onClean;
    this.connected = true;
  }

  async onSave () {
    if (!this.connected) return;

    this.saveErrors = null;

    const { response, okPayload } = await this.$api2.V3_request({
      path: '/groups/create',
      params: {
        record: {
          course_id: this.record.course?.[0]?.id,
          name: this.record.name ?? [],
          term: this.record.term,
        },
      },
      reducer: wai.recordUpdate,
    });

    this.saveErrors = app.api.createErrors(response) ?? null;
    if (this.saveErrors) {
      this.transaction.state.isProcessing = false;
      return;
    }

    this.onCleanAction?.();
    this.$router.push({ path: `/database/groups/${okPayload?.record_id}` });
  }
}
</script>

<template>
  <CountryDBPage>
    <EditRecordPage
      :active="connected"
      title="page.groups.new.title"
      :transaction="transaction"
      :save-errors="
        saveErrors
          ? { entity: 'groups', messages: saveErrors }
          : undefined
      "
      @connect="onConnect"
    >
      <div v-if="connected">
        <div class="row justify-content-center">
          <div class="col-md-6">
            <b-form-group>
              <template #label>
                <t value="db.record.groups.label.course" />
              </template>
              <BRecordsSelect
                :value="record.course"
                entity="courses"
                @change="record.course = $event"
              />
            </b-form-group>
            <b-form-group>
              <template #label>
                <t value="db.record.groups.label.name" />
              </template>
              <NameInput
                :value="record.name"
                @change="record.name = $event"
              />
            </b-form-group>
            <b-form-group>
              <template #label>
                <t value="db.record.groups.label.term" />
              </template>
              <IntegerInput
                :value="record.term"
                @change="record.term = $event"
              />
            </b-form-group>
          </div>
        </div>
      </div>
    </EditRecordPage>
  </CountryDBPage>
</template>
