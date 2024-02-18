<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import app from '~/lib/app';
import { BRecord } from '~/lib/api2';
import { get } from 'lodash';
import RecordNamedValue from '~/components/views/application/RecordNamedValue.vue';
import RecordId from '~/components/views/application/RecordId.vue';

export interface Association {
  entity: string;
  attr: string;
}

interface Item {
  entity: string;
  bRecord: BRecord;
}

@Component({
  components: { RecordId, RecordNamedValue },
})
export default class RecordAssociations extends Vue {
  @Prop({ required: true }) readonly record!: any;
  @Prop({ required: true }) readonly associations!: app.FilterableList<Association>;
  @Prop({ default: false }) readonly newTab!: boolean;

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
    <RecordNamedValue
      v-for="({ entity, bRecord }, index) in filteredList"
      :key="entity"
      :class="[
        'font-12',
        { 'mt-1': index > 0 }
      ]"
    >
      <template #label>
        <t :value="`db.record.${entity}.meta.s`" />
      </template>
      <RecordId
        class="font-14"
        :record="bRecord"
        :path="`/database/${entity}/${bRecord.id}`"
        :new-tab="newTab"
      />
    </RecordNamedValue>
  </div>
</template>
