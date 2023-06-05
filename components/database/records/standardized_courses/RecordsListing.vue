<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ARecordLink from '~/components/database/components/ARecordLink.vue';
import TextNames from '~/components/database/components/TextNames.vue';
import ARecordsListing from '~/components/database/components/listing/ARecordsListing.vue';
import { Params } from '~/lib/api2';
import { application_record } from '~/lib/records';
import { Column } from '~/components/DataTable/v3';
import BRecordLink from '~/components/database/components/BRecordLink.vue';

@Component({
  components: { BRecordLink, ARecordsListing, ARecordLink, TextNames },
})
export default class extends Vue {
  @Prop({ default: () => [] }) readonly initialColumns!: Column[];
  @Prop({ default: () => {} }) readonly params!: Params;

  columns = [
    { name: 'id', size: 80 },
    ...application_record.fillDataTableColumns('standardized_courses', [
      { name: 'grade', size: 80 },
      { name: 'name' },
      { name: 'education_level' },
      { name: 'accreditation_authority' },
      { name: 'description' },
    ]),
  ];
}
</script>

<template>
  <a-records-listing
    :class="$attrs.class"
    entity="standardized_courses"
    :initial-columns="initialColumns"
    :columns="columns"
    :params="params"
    @change="$emit('change', $event)"
  >
    <template #row="{ record }">
      <td>
        <a-record-link :id="record.id" entity="standardized_courses" />
      </td>
      <td>
        {{ record.grade }}
      </td>
      <td>
        <text-names class="single-row-cell" :value="record.name" />
      </td>
      <td>
        <b-record-link entity="education_levels" :record="record.education_level" />
      </td>
      <td>
        {{ record.accreditation_authority }}
      </td>
      <td>
        {{ record.description }}
      </td>
      <td />
    </template>
  </a-records-listing>
</template>
