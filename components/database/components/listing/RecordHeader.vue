<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import TextNames from '~/components/database/components/TextNames.vue';
import ARecordLink from '~/components/database/components/ARecordLink.vue';

@Component({
  components: {
    ARecordLink,
    TextNames,
  },
})
export default class RecordHeader extends Vue {
  @Prop({ required: true }) readonly record!: any;
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ default: () => 'name' }) readonly attr!: string;
}
</script>

<template>
  <div>
    <a-record-link
      :id="record.id"
      :entity="entity"
    />
    <text-names class="text-truncate" :value="record[attr]" />
  </div>
</template>
