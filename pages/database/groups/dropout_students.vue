<script lang="ts">
import { Component } from 'vue-property-decorator';
import controls from '~/components/controls';
import CountryDBPage from '~/components/database/pages/CountryDBPage.vue';
import app from '~/lib/app';
import { wai } from '~/vendor/wai';
import ActionPage2, { ActionParams } from '~/components/database/pages/ActionPage2.vue';
import { DropoutStudentsParams } from '~/components/database/records/groups/students/actions/ActionDropoutStudents.vue';
import { group } from '~/lib/records';
import RecordEditCard from '~/components/views/application/RecordEditCard/RecordEditCard.vue';
import EntityCardHeader from '~/components/database/pages/shared/EntityCardHeader.vue';
import RecordErrors from '~/components/database/RecordErrors.vue';
import DropoutGroup from '~/components/views/group/dropout/DropoutGroup.vue';
import DropoutReasons from '~/components/views/group/dropout/controls/DropoutReasons.vue';
import ReturnOn from '~/components/views/group/dropout/controls/ReturnOn.vue';
import DropoutNote from '~/components/views/group/dropout/controls/DropoutNote.vue';
import DropoutOn from '~/components/views/group/dropout/controls/DropoutOn.vue';
import RecordId from '~/components/views/application/RecordId.vue';
import AssociatedRecordsList from '~/components/views/application/AssociatedRecordsList.vue';

@Component({
  components: {
    AssociatedRecordsList,
    RecordId,
    DropoutOn,
    DropoutNote,
    ReturnOn,
    DropoutReasons,
    DropoutGroup,
    RecordErrors,
    EntityCardHeader,
    RecordEditCard,
    ActionPage2,
    CountryDBPage,
  },
})
export default class DropoutStudents extends CountryDBPage.ComponentBase {
  onCleanAction = app.nullable<() => void>();
  data = app.nullable<{
    group: group.V3_Group;
    students: wai.RecordsList;
  }>();

  dataFailMessage = app.nullable<string>();

  entity = group.dropout.entity;
  controls = app.nullable<controls.Group>();
  saveErrors = app.nullable<wai.ResourceError[]>();

  get dropoutGroup (): app.Maybe<group.dropout.GroupSlice> {
    if (this.data?.group.school_course) {
      return {
        school: this.data.group.school_course.school,
        course: this.data.group.school_course.course,
        group: this.data.group,
      };
    }
  }

  get isDisabled () {
    return !this.data || this.transaction.state.isProcessing;
  }

  get transaction () {
    return new app.Transaction(
      () => this.onSave(),
      () => this.$router.go(-1),
    );
  }

  async onConnect ({
    params,
    onClean,
  }: ActionParams<DropoutStudentsParams>) {
    this.onCleanAction = onClean;

    const groupResource = app.api.Resource.loadRecord(this, {
      path: '/v3/groups',
      reducer: group.V3_parseRecord,
      params: {
        id: params.groupId,
        slices: [ 'school_course' ],
      },
    });

    const studentsResource = app.api.Resource.loadRecords(this, {
      path: '/v3/people',
      params: {
        id: params.studentsIds,
        per_page: 100,
      },
    });

    await Promise.all([
      groupResource.promise,
      studentsResource.promise,
    ]);

    if (
      !groupResource.resource.state.resource ||
      !studentsResource.resource.state.resource
    ) {
      this.dataFailMessage = 'api.fail.load_data';
      return;
    }

    this.data = {
      group: groupResource.resource.state.resource,
      students: studentsResource.resource.state.resource,
    };
    this.controls = controls.Group.compose(
      DropoutReasons.asField(),
      DropoutOn.asField({
        default: () => new Date(),
      }),
      DropoutNote.asField(),
    );
  }

  async onSave () {
    if (!this.data || !this.controls) return;
    this.saveErrors = null;
    const returnPath = `/database/groups/${this.data.group.id}`;

    const result = await this.$api2.V3_request({
      path: '/groups/dropouts/group_create',
      params: {
        students_ids: this.data.students.records.map(r => r.id),
        record: {
          group_id: this.data.group.id,
          ...this.controls.getParams(),
        },
      },
      reducer: wai.recordUpdate,
    });
    this.saveErrors = app.api.updateErrors(result.response) ?? null;
    if (this.saveErrors) {
      this.transaction.state.isProcessing = false;
      return;
    }

    this.onCleanAction?.();
    await this.$router.replace({ path: returnPath });
  }
}
</script>

<template>
  <CountryDBPage>
    <ActionPage2
      :is-connected="!!data"
      :fail-message="dataFailMessage"
      @connect="onConnect"
    >
      <RecordEditCard
        :active="!!data"
        :is-processing="transaction.state.isProcessing"
        @save="transaction.commit"
        @cancel="transaction.cancel"
      >
        <template #header>
          <EntityCardHeader>
            <t value="page.EditPage.header.title" />
          </EntityCardHeader>
        </template>
        <template v-if="saveErrors" #errors>
          <RecordErrors :entity="entity" :errors="saveErrors" />
        </template>
        <div v-if="data" class="row">
          <div class="col-lg-6 mb-2">
            <h6>
              <t value="db.pages.groups.dropout_students.students.subtitle" />
              <br>
              <small>
                <t value="db.pages.groups.dropout_students.students.count" />
                <span>:</span>
                <span>{{ data.students.records.length }}</span>
              </small>
            </h6>
            <AssociatedRecordsList
              v-slot="student"
              :records="data.students.records"
            >
              <RecordId
                class="p-1 border"
                :record="student.record"
                :path="`/database/people/${student.record.id}`"
              />
            </AssociatedRecordsList>
          </div>
          <div class="col-lg-6 mb-2">
            <h6>
              <t value="views.group.dropout.DropoutEdit.group_title" />
            </h6>
            <DropoutGroup
              v-if="dropoutGroup"
              class="mt-2"
              :group="dropoutGroup"
            />
          </div>
        </div>
        <div v-if="controls" class="row mt-2">
          <div class="col-lg-6">
            <DropoutReasons
              :controls="controls"
              :disabled="isDisabled"
            />
          </div>
          <div class="col-lg-6">
            <DropoutOn
              :controls="controls"
              :disabled="isDisabled"
            />
            <DropoutNote
              :controls="controls"
              :disabled="isDisabled"
              @submit="transaction.commit"
            />
          </div>
        </div>
      </RecordEditCard>
    </ActionPage2>
  </CountryDBPage>
</template>
