<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import app from '~/lib/app';
import { application_record, group } from '~/lib/records';
import RecordsListing from '~/components/views/application/RecordsListing/RecordsListing.vue';
import PrintTime from '~/components/toolkit/PrintTime.vue';
import UserLogin from '~/components/views/user/UserLogin.vue';
import AssociatedRecordsList from '~/components/views/application/AssociatedRecordsList.vue';
import RecordId from '~/components/views/application/RecordId.vue';
import { students_change } from '~/lib/records/group';

@Component({
  computed: {
    students_change () {
      return students_change;
    },
  },
  components: { RecordId, AssociatedRecordsList, UserLogin, PrintTime, RecordsListing },
})
export default class AssignmentHistoryListing extends Vue {
  @Prop({ required: true }) readonly group!: group.Group;

  resource = new app.api.Resource(
    `/v3/groups/${this.group.id}/students_changes`,
    value => app.api.wai.recordsListing(
      value, group.students_change.parseRecord,
    ),
  )

  orderByOptions = [ 'id' ].map(
    value => ({
      value,
      item: 'db.record.groups.students_changes.order_by.id.option',
    } as app.OptionItem<string>),
  );

  columns = [
    ...application_record.fillDataTableColumns('groups.students_changes', [
      { name: 'timestamp', size: 150 },
      { name: 'user', size: 150 },
      { name: 'students', size: 800 },
    ]),
  ];

  created () {
    this.resource.bindApiClient(this.$api2);
    this.resource.setDefaultParams({ slices: [ 'assignment_record' ] });
    this.onReload();
  }

  onReload () {
    this.resource.updateParams();
    this.resource.fetch();
  }
}
</script>

<template>
  <RecordsListing
    :columns="columns"
    :resource="resource"
    :order-by-options="orderByOptions"
    @listingChange="onReload"
  >
    <template #row="{ record }">
      <td>
        <PrintTime
          class="font-14 text-muted"
          :value="record.assignment_record?.created_at"
        />
      </td>
      <td>
        <UserLogin :user="record.assignment_record?.created_by" />
      </td>
      <td>
        <div>
          <div
            v-if="record.assignment_record?.operation === 'a'"
            class="font-14"
          >
            <t value="w.group.students_change.AssignmentHistoryListing.action.a.header" />
          </div>
          <div
            v-if="record.assignment_record?.operation === 'r'"
            class="font-14"
          >
            <t value="w.group.students_change.AssignmentHistoryListing.action.r.header" />
          </div>
          <AssociatedRecordsList
            v-slot="student"
            :records="record.assignment_record?.students"
          >
            <RecordId
              class="p-1 border"
              :record="student.record"
              :path="`/database/people/${student.record.id}`"
            />
          </AssociatedRecordsList>
        </div>
      </td>
    </template>
  </RecordsListing>
</template>
