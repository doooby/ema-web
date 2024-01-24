<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { group } from '~/lib/records';
import ShowPageTableRow from '~/components/database/ShowPageTableRow.vue';
import RecordId from '~/components/views/application/RecordId.vue';
import CreateGroup from '~/components/views/group/CreateGroup.vue';

@Component({
  components: { CreateGroup, RecordId, ShowPageTableRow },
})
export default class LinkedGroups extends Vue {
  @Prop({ required: true }) readonly group!: group.Group;
}
</script>

<template>
  <ShowPageTableRow label="group.linked_groups.LinkedGroups.row">
    <div
      v-if="group.parent"
    >
      <t value="group.linked_groups.LinkedGroups.parent" />
      <RecordId
        class="font-14"
        :record="group.parent"
        :path="`/database/groups/${group.parent.id}`"
      />
    </div>
    <div v-else>
      <div
        v-for="linked_group of group.linked_groups"
        :key="linked_group.id"
        class="mb-2"
      >
        <RecordId
          class="font-14"
          :record="linked_group"
          :path="`/database/groups/${linked_group.id}`"
        />
      </div>

      <div
        v-if="$ema.canI('act:/groups/actions/create_linked')"
        :class="[ { 'mt-3': group.linked_groups?.length } ]"
      >
        <CreateGroup
          class="font-14 btn-sm"
          :parent="{ id: group.id, caption: group.caption}"
        >
          <b-icon icon="plus-lg" />
          <t value="group.linked_groups.CreateLinkedGroup.text" />
        </CreateGroup>
      </div>
    </div>
  </ShowPageTableRow>
</template>
