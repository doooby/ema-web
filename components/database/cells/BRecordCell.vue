<template>
  <div class="single-row-cell">
    <b-record-link
      v-if="bRecord"
      :entity="column.cell.entity"
      :record="bRecord"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { DataTable } from '~/components/DataTable';
import BRecordLink from '~/components/database/BRecordLink.vue';

@Component({
  components: { BRecordLink },
})
export default class BRecordLinkCell extends Vue {
  @Prop({ required: true }) readonly column!: DataTable.Column;
  @Prop({ required: true }) readonly dataItem!: any;

  get bRecord () {
    return this.dataItem[this.column.name];
  }

  get caption (): string {
    const textGet = this.column.cell!.caption;
    if (textGet) return safeGetText(textGet, this.dataItem);
    return this.bRecord?.caption;
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
