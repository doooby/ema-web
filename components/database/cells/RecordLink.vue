<template>
  <div class="single-row-cell">
    <code v-if="column.cell.onlyId">
      [{{ dataItem.id }}]
    </code>
    <show-record-link
      v-else
      :entity="column.cell.entity"
      :record="{ id: dataItem.id, caption: caption }"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { DataTable } from '~/components/DataTable';
import ShowRecordLink from '~/components/database/ShowRecordLink.vue';

@Component({
  components: { ShowRecordLink },
})
export default class Record extends Vue {
  @Prop({ required: true }) readonly column!: DataTable.Column;
  @Prop({ required: true }) readonly dataItem!: any;

  get caption (): string {
    const textGet = this.column.cell!.text;
    if (textGet) return safeGetText(textGet, this.dataItem);
    return this.dataItem.id;
  }
}

function safeGetText (getText: any, dataItem: any): any {
  try {
    return getText?.(dataItem);
  } catch (err) {
    utils.warn(err, { 'database.cells.AssociatedRecord': 'getText failed' });
    return null;
  }
}
</script>
