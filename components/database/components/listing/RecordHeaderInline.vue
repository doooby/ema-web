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
export default class RecordHeaderInline extends Vue {
  @Prop({ required: true }) readonly record!: any;
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ default: () => 'name' }) readonly attr!: string;
}
</script>

<template>
  <div>
    <text-names class="text-truncate" :value="record[attr]">
      <template #prepend>
        <a-record-link
          :id="record.id"
          class="link mr-2"
          :entity="entity"
        />
      </template>
    </text-names>
  </div>
</template>

<style scoped>
.link {
  flex-basis: 80px;
}
</style>
