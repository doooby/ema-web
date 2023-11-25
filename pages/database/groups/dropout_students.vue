<script lang="ts">
import { Component, Watch } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import ActionPage, { ActionParams } from '~/components/database/pages/ActionPage.vue';
import { DropoutStudentsParams } from '~/components/database/records/groups/students/actions/ActionDropoutStudents.vue';
import { group } from '~/lib/records';
import { wai } from '~/vendor/wai';
import ActionPageContent from '~/components/database/pages/ActionPageContent.vue';
import RecordId from '~/components/views/application/RecordId.vue';
import AssociatedRecordsList from '~/components/views/application/AssociatedRecordsList.vue';
import RecordNamedValue from '~/components/views/application/RecordNamedValue.vue';
import controls from '~/components/controls';
import app from '~/lib/app';
import { DateInput, OptionsSelect, TextArea } from '~/components/controls/inputs';
import CardSaveableFooter from '~/components/database/components/CardSaveableFooter.vue';
import RecordErrors from '~/components/database/RecordErrors.vue';
import DropoutReasons from '~/components/views/group/dropout/controls/DropoutReasons.vue';
import DropoutOn from '~/components/views/group/dropout/controls/DropoutOn.vue';

@Component({
  components: {
    DropoutOn,
    DropoutReasons,
    DateInput,
    RecordErrors,
    CardSaveableFooter,
    TextArea,
    OptionsSelect,
    RecordNamedValue,
    AssociatedRecordsList,
    RecordId,
    ActionPageContent,
    ActionPage,
  },
})
export default class DropoutStudents extends DatabasePage {
  connected = false;
  data: any = null;
  saveErrors: null | app.Maybe<wai.ResourceError[]> = null;

  onCleanAction?: () => void;

  created () {
    this.reCreateControlsGroup();
  }

  get disabled () {
    return false;
  }

  get returnPath (): string {
    if (this.data && this.data.group.id) {
      const groupId = this.data.group.id;
      return `/database/groups/${groupId}`;
    } else {
      return '/database/people';
    }
  }

  async onSave () {
    this.saveErrors = undefined;

    const result = await this.$api2.V3_request({
      path: '/groups/dropouts/group_create',
      params: {
        students_ids: this.data.students.records.map(r => r.id),
        record: {
          group_id: this.data.group.id,
          ...this.controlsGroup.getParams(),
        },
      },
      reducer: wai.recordUpdate,
    });

    if (result.okPayload && !result.okPayload.errors?.length) {
      await this.$router.replace({ path: this.returnPath });
      return;
    }

    this.saveErrors = app.api.updateErrors(result.response) ?? [
      [ undefined, 'failed' ],
    ];
  }

  async onConnect ({
    params,
    onClean,
  }: ActionParams<DropoutStudentsParams>): Promise<void> {
    this.onCleanAction = onClean;

    const data = {
      group: await this.$api2.V3_createLoader({
        path: '/groups',
        params: {
          id: params.groupId,
          per_page: 1,
          slices: [ 'school_course' ],
        },
        reducer: value => wai.recordShow(value, group.V3_parseRecord),
      }).onReload?.(),
      students: await this.$api2.V3_createLoader({
        path: '/people',
        params: {
          id: params.studentsIds,
          per_page: 100,
        },
        reducer: value => wai.recordsList(value),
      }).onReload?.(),
    };

    this.connected = true;
    this.data =
      (
        data.group && data.group.school_course &&
          data.students && data.students.records.length &&
          data
      ) || undefined;
  }

  controlsGroup = controls.Group.compose();

  @Watch('currentCountry')
  reCreateControlsGroup () {
    this.controlsGroup = controls.Group.compose(
      DropoutReasons.asField(this),
      {
        ...DropoutOn.asField(this),
        default: () => new Date(),
      },
      {
        name: 'note',
        populateParams: (values: any, params) => {
          params.note = values.note;
        },
      },
    );
  }
}
</script>

<template>
  <ActionPage :is-loaded="!!data" @connect="onConnect">
    <ActionPageContent v-if="connected" :present="!!data">

      <div v-if="data" class="row">
        <div class="col justify-content-md-center">
          <div class="card">

            <div class="card-header">
              <h2 class="m-0">
                <t value="db.pages.groups.dropout_students.title" />
              </h2>
            </div>

            <div class="card-body pt-3 pt-0">

              <div>
                <h4 class="mt-2">
                  <t value="db.pages.groups.dropout_students.students.subtitle" />
                </h4>
                <h6>
                  <t value="db.pages.groups.dropout_students.students.count" />
                  <span>:</span>
                  <span>{{ data.students.records.length }}</span>
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

              <div>
                <h4 class="mt-2">
                  <t value="db.pages.groups.dropout_students.group.subtitle" />
                </h4>
                <RecordNamedValue>
                  <template #label>
                    <t value="db.record.schools.meta.s" />
                  </template>
                  <RecordId
                    :record="data.group.school_course?.school"
                    :path="`/database/schools/${data.group.school_course?.school.id}`"
                  />
                </RecordNamedValue>
                <RecordNamedValue>
                  <template #label>
                    <t value="db.record.courses.meta.s" />
                  </template>
                  <RecordId
                    :record="data.group.school_course?.course"
                    :path="`/database/courses/${data.group.school_course?.course.id}`"
                  />
                </RecordNamedValue>
                <RecordNamedValue>
                  <template #label>
                    <t value="db.record.groups.meta.s" />
                  </template>
                  <RecordId
                    :record="data.group"
                    :path="`/database/groups/${data.group.id}`"
                  />
                </RecordNamedValue>
              </div>

              <div>
                <h4 class="mt-2">
                  <t value="db.pages.groups.dropout_students.dropout.subtitle" />
                </h4>
                <div class="row">
                  <DropoutReasons
                    class="col-lg-6"
                    :controls="controlsGroup"
                    :disabled="disabled"
                  />
                  <div class="col-lg-6">
                    <DropoutOn
                      :controls="controlsGroup"
                      :disabled="disabled"
                    />
                    <b-form-group>
                      <template #label>
                        <t value="db.record.groups.dropout_students.note" />
                      </template>
                      <TextArea
                        :value="controlsGroup.getValue('note')"
                        :disabled="disabled"
                        @change="controlsGroup.update('note', $event)"
                        @submit="onSave"
                      />
                    </b-form-group>
                  </div>
                </div>
              </div>

            </div>

            <CardSaveableFooter
              :disabled="disabled"
              @save="onSave"
              @cancel="$router.go(-1)"
            >
              <template v-if="saveErrors" #fail-content>
                <RecordErrors entity="groups" :errors="saveErrors" />
              </template>
            </CardSaveableFooter>

          </div>
        </div>
      </div>

    </ActionPageContent>
  </ActionPage>
</template>
