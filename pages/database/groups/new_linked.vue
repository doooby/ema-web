<script lang="ts">
import { Component } from 'vue-property-decorator';
import app from '~/lib/app';
import { wai } from '~/vendor/wai';
import EditRecordPage from '~/components/views/application/pages/EditRecordPage.vue';
import { ActionParams } from '~/components/database/pages/ActionPage2.vue';
import { ErrorMessage } from '~/lib/api2';
import { BRecordsSelect, NameInput, IntegerInput } from '~/components/controls/inputs';
import CountryDBPage from '~/components/database/pages/CountryDBPage.vue';
import RecordId from '~/components/views/application/RecordId.vue';
import { group } from '~/lib/records';

export interface CreateLinkedGroupParams {
  parent: wai.AResource;
}

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
export default class New_linked extends CountryDBPage.ComponentBase {
  onCleanAction = app.nullable<() => void>();

  pageData = app.nullable<{
    group: group.V3_Group;
  }>();

  record: app.Map<any> = {
    course: undefined,
    name: undefined,
  };

  saveErrors = app.nullable<ErrorMessage[]>();

  get transaction () {
    return new app.Transaction(
      () => this.onSave(),
      () => this.$router.go(-1),
    );
  }

  async onConnect ({
    params,
    onClean,
  }: ActionParams<CreateLinkedGroupParams>) {
    this.onCleanAction = onClean;

    const { okPayload } = await this.$api2.V3_request({
      path: '/groups',
      params: {
        id: params.parent.id ?? '-1',
        slices: [ 'school_course' ],
      },
      reducer: value => wai.recordShow(value, group.V3_parseRecord),
    });

    if (!okPayload?.record) {
      return;
    }

    this.pageData = {
      group: okPayload.record,
    };
  }

  async onSave () {
    if (!this.pageData) return;

    this.saveErrors = null;

    const { response, okPayload } = await this.$api2.V3_request({
      path: '/groups/create_linked',
      params: {
        was: 1,
        record: {
          parent_id: this.pageData.group.id,
          course_id: this.record.course?.[0]?.id,
          name: this.record.name ?? [],
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
      :active="!!pageData"
      title="page.groups.new_linked.title"
      :transaction="transaction"
      :save-errors="
        saveErrors
          ? { entity: 'groups', messages: saveErrors }
          : undefined
      "
      @connect="onConnect"
    >
      <div class="row justify-content-center">
        <div class="col-md-6">
          <b-form-group>
            <template #label>
              <t value="page.groups.new.parent_id.label" />
            </template>
            <RecordId
              :record="pageData?.group"
              :path="`/database/groups/${pageData?.group.id}`"
              :new-tab="true"
            />
            <div class="alert alert-info mt-1 mb-0">
              <t value="page.groups.new.parent_id.message" />
            </div>
          </b-form-group>
          <b-form-group>
            <template #label>
              <t value="db.record.groups.label.course" />
            </template>
            <BRecordsSelect
              :value="record.course"
              entity="courses"
              :params="{ school_id: pageData?.group?.school_course?.school?.id }"
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
        </div>
      </div>
    </EditRecordPage>
  </CountryDBPage>
</template>
