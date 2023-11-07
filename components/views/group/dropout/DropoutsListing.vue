<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import app from '~/lib/app';
import { application_record, group } from '~/lib/records';
import RecordId from '~/components/views/application/RecordId.vue';
import AssociatedRecordsList from '~/components/views/application/AssociatedRecordsList.vue';
import RecordsListing from '~/components/views/application/RecordsListing/RecordsListing.vue';
import PrintTime from '~/components/toolkit/PrintTime.vue';
import UserLogin from '~/components/views/user/UserLogin.vue';
import PrintDate from '~/components/toolkit/PrintDate.vue';
import RecordNamedValue from '~/components/views/application/RecordNamedValue.vue';

type SearchParams =
  | { group_id: string }
  | { student_id: string };

@Component({
  components: {
    RecordNamedValue,
    PrintDate,
    UserLogin,
    PrintTime,
    RecordsListing,
    AssociatedRecordsList,
    RecordId,
  },
})
export default class DropoutsListing extends Vue {
  @Prop({ required: true }) readonly params!: SearchParams;

  get resource () {
    const resource = new app.api.Resource(
      '/v3/groups/dropouts',
      value => app.api.wai.recordsListing(
        value, group.dropout.parseRecord,
      ),
    );

    const slices = [ 'record' ];

    if ('group_id' in this.params) {
      resource.setDefaultParams({
        slices,
        group_id: this.params.group_id,
      });
    } else if ('student_id' in this.params) {
      resource.setDefaultParams({
        slices,
        student_id: this.params.student_id,
      });
    }

    resource.bindApiClient(this.$api2);
    return resource;
  }

  orderByOptions = [
    'id',
  ].map(
    value => ({
      value,
      item: 'db.record.groups.dropouts.order_by.id.option',
    } as app.OptionItem<string>),
  );

  get columns () {
    return [
      ...application_record.fillDataTableColumns('groups.dropouts', [
        { name: 'student', size: 150 },
        { name: 'timestamp', size: 150 },
        { name: 'user', size: 150 },
        { name: 'dates', size: 150 },
        { name: 'reason', size: 200 },
      ]),
    ];
  }

  created () {
    this.onReload();
  }

  onReload () {
    this.resource.updateParams();
    this.resource.fetch();
  }
}
</script>

<template>
  <div>
    <RecordsListing
      :columns="columns"
      :resource="resource"
      :order-by-options="orderByOptions"
      @listingChange="onReload"
    >
      <template #row="{ record }">
        <td>
          <RecordId
            :record="record.record?.student"
            :show-link="`/database/people/${record.record?.student.id}`"
          />
        </td>
        <td>
          <PrintTime
            class="font-14 text-muted"
            :value="record.record?.created_at"
          />
        </td>
        <td>
          <UserLogin :user="record.record?.created_by" />
        </td>
        <td>
          <RecordNamedValue
            v-if="record.record?.return_on"
          >
            <template #label>
              <t value="db.record.groups.dropouts.label.return_on" />
            </template>
            <PrintDate :value="record.record?.return_on" />
          </RecordNamedValue>
          <RecordNamedValue
            class="mt-1"
          >
            <template #label>
              <t value="db.record.groups.dropouts.label.dropout_on" />
            </template>
            <PrintDate :value="record.record?.dropout_on" />
          </RecordNamedValue>
          <RecordNamedValue
            v-if="record.record?.return_on"
            class="mt-1"
          >
            <template #label>
              <t value="db.record.groups.dropouts.label.archived_at" />
            </template>
            <PrintDate :value="record.record?.archived_at" />
          </RecordNamedValue>
          <PrintDate />
        </td>
        <td>
          <div >
            {{ record.record?.reasons?.join('; ') }}
          </div>
          <div
            v-if="record.record?.note"
            class="mt-1"
          >
            {{ record.record?.note }}
          </div>
        </td>
      </template>
    </RecordsListing>
  </div>
</template>
