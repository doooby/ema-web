<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import app from '~/lib/app';
import { application_record, group } from '~/lib/records';
import RecordId from '~/components/views/application/RecordId.vue';
import AssociatedRecordsListing from '~/components/views/application/AssociatedRecordsListing.vue';
import RecordsListing from '~/components/views/application/RecordsListing/RecordsListing.vue';
import PrintTime from '~/components/toolkit/PrintTime.vue';
import UserLogin from '~/components/views/user/UserLogin.vue';

type SearchParams =
  | { group_id: string }
  | { student_id: string };

@Component({
  components: {
    UserLogin,
    PrintTime,
    RecordsListing,
    AssociatedRecordsListing,
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
        { name: 'timestamp', size: 150 },
        { name: 'user', size: 150 },
        { name: 'reason', size: 150 },
        { name: 'students', size: 800 },
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
          <PrintTime :value="record.record?.created_at" />
        </td>
        <td>
          <UserLogin :user="record.record?.created_by" />
        </td>
        <td>
          <div>
            <AssociatedRecordsListing
              v-slot="student"
              :records="record.record?.students"
            >
              <RecordId
                :record="student.record"
                :show-link="`/database/people/${student.record.id}`"
              />
            </AssociatedRecordsListing>
          </div>
        </td>
        <td>
          // reason
        </td>
      </template>
    </RecordsListing>
  </div>
</template>
