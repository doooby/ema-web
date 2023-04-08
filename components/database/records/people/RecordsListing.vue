<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { DataTable } from '~/components/DataTable';
import ARecordLink from '~/components/database/components/ARecordLink.vue';
import TextNames from '~/components/database/components/TextNames.vue';
import ARecordsListing from '~/components/database/components/listing/ARecordsListing.vue';
import { Params } from '~/lib/api2';
import Name from '~/components/database/cells/Name.vue';
import Date from '~/components/database/cells/Date.vue';

@Component({
  components: { ARecordsListing, ARecordLink, TextNames },
})
export default class RecordsListing extends Vue {
  @Prop({ default: () => [] }) readonly initialColumns!: DataTable.Column[];
  @Prop({ default: () => {} }) readonly params!: Params;

  tableColumns = [
    ...this.initialColumns,
    { name: 'id', size: 80 },
    { name: 'student_kobo_no' },
    { name: 'first_name', cell: { type: Name } },
    { name: 'last_name', cell: { type: Name } },
    { name: 'born_on', cell: { type: Date } },
  ];
}
</script>

<template>
  <a-records-listing
    :class="$attrs.class"
    entity="people"
    :table-columns="tableColumns"
    :params="params"
    @list="$emit('list', $event)"
  >
    <template
      v-for="name of initialColumns.map(col => `col-h-${col.name}`)"
      #[name]
    >
      <slot :name="name" />
    </template>
    <template #body="{ records }">
      <tr v-for="record of records" :key="record.id">
        <td v-for="column in initialColumns" :key="column.name">
          <slot :name="`col-${column.name}`" :record="record" />
        </td>
        <td>
          <a-record-link :id="record.id" entity="people" />
        </td>
        <td>
          {{ record.student_kobo_no }}
        </td>
        <td>
          <text-names class-name="single-row-cell" :value="record.first_name" />
        </td>
        <td>
          <text-names class-name="single-row-cell" :value="record.last_name" />
        </td>
        <td>
          <span v-if="record.born_on">{{ $d(record.born_on) }}</span>
        </td>
        <td />
      </tr>
    </template>
  </a-records-listing>
</template>
