<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ARecordLink from '~/components/database/components/ARecordLink.vue';
import TextNames from '~/components/database/components/TextNames.vue';
import ARecordsListing from '~/components/database/components/listing/ARecordsListing.vue';
import { Params } from '~/lib/api2';
import { Column } from '~/components/DataTable/v3';
import { application_record } from '~/lib/records';
import BRecordLink from '~/components/database/components/BRecordLink.vue';

@Component({
  components: { BRecordLink, ARecordsListing, ARecordLink, TextNames },
})
export default class RecordsListing extends Vue {
  @Prop({ default: () => [] }) readonly initialColumns!: Column[];
  @Prop({ default: () => {} }) readonly params!: Params;

  columns = [
    { name: 'id', size: 80 },
    ...application_record.fillDataTableColumns('people', [
      { name: 'student_kobo_no' },
      { name: 'first_name' },
      { name: 'school' },
      { name: 'school' },
    ]),
  ];
}
</script>

<template>
  <a-records-listing
    :class="$attrs.class"
    entity="people"
    :initial-columns="initialColumns"
    :columns="columns"
    :params="params"
    @change="$emit('change', $event)"
  >
    <template #row="{ record }">
      <td>
        <div class="text-center">
          <a-record-link :id="record.id" entity="people" />
        </div>
      </td>
      <td>
        {{ record.external_id || record.student_kobo_no }}
        <br>
        {{ record.navision_id }}
      </td>
      <td>
        {{ record.first_name[1] }} {{ record.last_name[1] }}
        <br>
        {{ record.last_name[2] }} {{ record.first_name[2] }}
        <span v-if="record.born_on">{{ $d(record.born_on) }}</span>
      </td>
      <td>
        <b-record-link
          entity="schools"
          :record="record.school"
        />
        <br>
        <b-record-link
          entity="courses"
          :record="record.course"
        />
        <br>
        <b-record-link
          entity="groups"
          :record="record.group"
        />
      </td>
      <td>
        <b-record-link
          entity="schools"
          :record="record.school"
        />
        <br>
        <b-record-link
          entity="donors"
          :record="record.donor"
        />
      </td>
    </template>
    <template #footer>
      <slot name="footer" />
    </template>
  </a-records-listing>
</template>
