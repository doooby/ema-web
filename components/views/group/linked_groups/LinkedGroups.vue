<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { group } from '~/lib/records';
import ShowPageTableRow from '~/components/database/ShowPageTableRow.vue';
import RecordId from '~/components/views/application/RecordId.vue';
import { wai } from '~/vendor/wai';
import app from '~/lib/app';
import ButtonToAction from '~/components/views/application/buttons/ButtonToAction.vue';
import MiniToggle from '~/components/views/application/buttons/MiniToggle.vue';

@Component({
  components: { MiniToggle, ButtonToAction, RecordId, ShowPageTableRow },
})
export default class LinkedGroups extends Vue {
  @Prop({ required: true }) readonly group!: group.Group;

  showArchived = false;

  get shownGroups (): app.Maybe<wai.AResource[]> {
    if (this.showArchived) {
      return this.group.linked_groups;
    } else {
      return this.group.linked_groups?.filter(
        group => !group.archived_at,
      );
    }
  }

  get anyArchivedGroup () {
    return this.group.linked_groups?.some(group => group.archived_at) ?? false;
  }
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
        v-if="anyArchivedGroup"
        class="mb-2 d-flex justify-content-end"
      >
        <div>
          <button
            class="btn btn-xs btn-link d-flex align-items-center font-14 text-archived"
            type="button"
            @click="showArchived = !showArchived"
          >
            <b-icon
              :icon="showArchived ? 'eye-slash' : 'eye' "
              class="mr-2"
            />
            <t :value="showArchived ? 'app.hide_archived' : 'app.show_archived'" />
          </button>
        </div>
      </div>
      <div
        v-for="linked_group of shownGroups"
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
        :class="[ { 'mt-3': shownGroups?.length } ]"
      >
        <ButtonToAction
          class="font-14 btn-sm btn-outline-secondary border-0"
          new-page="/database/groups/new_linked"
          :data="{ parent: { id: group.id, caption: group.caption} }"
        >
          <b-icon icon="plus" class="mr-1" />
          <t value="group.linked_groups.CreateLinkedGroup.text" />
        </ButtonToAction>
      </div>
    </div>
  </ShowPageTableRow>
</template>
