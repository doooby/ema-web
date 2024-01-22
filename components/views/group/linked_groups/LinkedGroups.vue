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
      v-if="group.parent_link"
      class=""
    >
      <t value="views.group.linked_groups.parent.text" />
      <RecordId
        class="font-14"
        :record="group.parent_link"
        :path="`/database/groups/${group.parent_link.id}`"
      />
    </div>
    <div v-else-if="group.pss_link">
      <t value="views.group.linked_groups.pss.text" />
      <RecordId
        class="font-14"
        :record="group.pss_link"
        :path="`/database/groups/${group.pss_link.id}`"
      />
    </div>
  </ShowPageTableRow>
</template>
