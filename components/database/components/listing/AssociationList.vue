<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import BRecordLink from '~/components/database/components/BRecordLink.vue';
import { BRecord } from '~/lib/api2';

@Component({
  components: { BRecordLink },
})
export default class AssociationList extends Vue {
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ default: undefined }) readonly records!: undefined | BRecord[];
}
</script>

<template>
  <ul>
    <li v-for="record in records ?? []" :key="record.id">
      <BRecordLink :entity="entity" :record="record" />
    </li>
  </ul>
</template>
