<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import SelectRecordBox from '~/components/database/components/listing/SelectRecordBox.vue';
import RecordActionsMenu, { Action } from '~/components/database/components/listing/RecordActionsMenu.vue';

@Component({
  components: {
    RecordActionsMenu,
    SelectRecordBox,
  },
})
export default class ActionsCell extends Vue {
  @Prop({ required: true }) readonly selected!: boolean;
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ required: true }) readonly record!: any;
  @Prop({ required: true }) readonly actions!: Action[];
}
</script>

<template>
  <div class="my-2">
    <SelectRecordBox
      :record="record"
      :selected="false"
    />
    <RecordActionsMenu
      class="mt-2"
      :entity="entity"
      :record="record"
      :actions="actions"
    />
  </div>
</template>
