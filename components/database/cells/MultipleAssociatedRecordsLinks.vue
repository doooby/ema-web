<template>
  <div>
    <div
      v-for="(record, i) in associatedRecords"
      :key="i"
    >
      <code v-if="column.cell.noLink">
        [{{ record.id }}] {{ record.labels.caption }}
      </code>
      <show-record-link
        v-else
        :entity="column.cell.entity"
        :record="{ id: record.id, caption: record.labels.caption }"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { DataTable } from '~/components/DataTable';
import ShowRecordLink from '~/components/database/ShowRecordLink.vue';

@Component({
  components: { ShowRecordLink },
})
export default class MultipleAssociatedRecordsLinks extends Vue {
  @Prop({ required: true }) readonly column!: DataTable.Column;
  @Prop({ required: true }) readonly dataItem!: any;

  get associatedRecords () {
    return this.dataItem[this.column.name];
  }
}
</script>
