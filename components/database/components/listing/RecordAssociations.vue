<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import BRecordLink from '~/components/database/components/BRecordLink.vue';
import app from '~/lib/app';
import { BRecord } from '~/lib/api2';
import { get } from 'lodash';

export interface Association {
  entity: string;
  attr: string;
}

interface Item {
  entity: string;
  bRecord: BRecord;
}

@Component({
  components: { BRecordLink },
})
export default class RecordAssociations extends Vue {
  @Prop({ required: true }) readonly record!: any;
  @Prop({ required: true }) readonly associations!: app.FilterableList<Association>;

  get filteredList () {
    return filterAssociations(this.record, this.associations);
  }
}

function filterAssociations (record, list): Item[] {
  return list
    .map((item) => {
      const bRecord = item && get(record, item.attr);
      return bRecord ? { entity: item.entity, bRecord } : undefined;
    })
    .filter(i => i) as Item[];
}
</script>

<template>
  <div>
    <div
      v-for="{ entity, bRecord } in filteredList"
      :key="entity"
      class="text-truncate font-12"
    >
      <small class="text-muted">
        <t :value="`db.record.${entity}.meta.s`" />
      </small>
      <br>
      <BRecordLink :entity="entity" :record="bRecord" />
    </div>
  </div>
</template>
