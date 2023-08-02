<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { group } from '~/lib/records';
import PeopleListing from '~/components/database/records/people/PeopleListing.vue';
import RemoveStudents from '~/components/database/records/groups/StudentsListing/actions/RemoveStudents.vue';
import { Model } from '~/components/database/components/listing/ARecordsListing.vue';

@Component({
  components: {
    PeopleListing,
    RemoveStudents,
  },
})
export default class StudentsListing extends Vue {
  @Prop({ required: true }) readonly group!: group.Group;

  searchParams = {
    group_id: this.group.id,
  };

  model: null | Model = null;

  onRefresh () {
    this.searchParams = { ...this.searchParams };
  }

  get selectedIds (): string[] {
    return this.model?.selected.map(({ id }: any) => id) ?? [];
  }
}
</script>

<template>
  <div class="mt-3">
    <div class="ml-1 d-flex align-items-center">
      <b-button
        variant="outline-secondary"
        size="xs"
        @click="model?.toggleSelectAll()"
      >
        <b-icon :icon="model?.isAllSelected ? 'x' : 'check-all'" />
      </b-button>
      <div class="ml-3">
        {{ model?.selected.length }}
      </div>
      <div class="ml-3">
        <b-dropdown
          :disabled="!model?.selected.length"
          size="sm"
          toggle-class="py-0"
        >
          <template #button-content>
            <t value="db.record.groups.students.actions.btn_caption" />
          </template>
          <remove-students :group="group" :ids="selectedIds" @done="onRefresh" />
        </b-dropdown>
      </div>
    </div>
    <people-listing
      class="mt-2"
      :params="searchParams"
      @connect="model = $event"
    />
  </div>
</template>
