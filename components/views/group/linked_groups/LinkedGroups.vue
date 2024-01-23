<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { group } from '~/lib/records';
import ShowPageTableRow from '~/components/database/ShowPageTableRow.vue';
import RecordId from '~/components/views/application/RecordId.vue';

@Component({
  components: { RecordId, ShowPageTableRow },
})
export default class LinkedGroups extends Vue {
  @Prop({ required: true }) readonly group!: group.Group;
}
</script>

<template>
  <ShowPageTableRow label="views.group.linked_groups.row_label">
    <div
      v-if="group.parent"
    >
      <t value="views.group.linked_groups.parent.text" />
      <RecordId
        class="font-14"
        :record="group.parent"
        :path="`/database/groups/${group.parent.id}`"
      />
    </div>
    <div v-else-if="group.linked_groups?.length">
      <div v-if="group.parent" class="mt-2" />
      <div v-for="linked_group of group.linked_groups" :key="linked_group.id">
        <div class="font-12 text-muted">
          <t value="db.record.groups.caption.pss_group" />
        </div>
        <RecordId
          class="font-14"
          :record="linked_group"
          :path="`/database/groups/${linked_group.id}`"
        />
      </div>
    </div>
  </ShowPageTableRow>
</template>
