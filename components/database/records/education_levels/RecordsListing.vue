<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { DataTable } from '~/components/DataTable';
import ARecordLink from '~/components/database/components/ARecordLink.vue';
import TextNames from '~/components/database/components/TextNames.vue';
import ARecordsListing from '~/components/database/components/listing/ARecordsListing.vue';
import { Params } from '~/lib/api2';

@Component({
  components: { ARecordsListing, ARecordLink, TextNames },
})
export default class RecordsListing extends Vue {
  @Prop({ default: () => [] }) readonly initialColumns!: DataTable.Column[];
  @Prop({ default: () => {} }) readonly params!: Params;

  tableColumns = [
    ...this.initialColumns,
    { name: 'id', size: 80 },
    { name: 'level', size: 80 },
    { name: 'name', size: 400 },
  ];
}
</script>

<template>
  <a-records-listing
    :class="$attrs.class"
    entity="education_levels"
    :table-columns="tableColumns"
    :params="params"
  >
    <template #body="{ records }">
      <tr v-for="record of records" :key="record.id">
        <td v-for="column in initialColumns" :key="column.name">
          <slot :name="`col-${column.name}`" :record="record" />
        </td>
        <td>
          <a-record-link :id="record.id" entity="education_levels" />
        </td>
        <td>
          {{ record.level }}
        </td>
        <td>
          <text-names class-name="single-row-cell" :value="record.name" />
        </td>
        <td />
      </tr>
    </template>
  </a-records-listing>
</template>
