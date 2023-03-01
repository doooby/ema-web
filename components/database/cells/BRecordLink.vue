<template>
  <div class="single-row-cell">
    <div v-if="bRecord">
      <code v-if="column.cell.noLink">
        [{{ bRecord.id }}] {{ caption }}
      </code>
      <show-record-link
        v-else
        :entity="column.cell.entity"
        :record="{ id: bRecord.id, caption: caption }"
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
export default class BRecordLink extends Vue {
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
