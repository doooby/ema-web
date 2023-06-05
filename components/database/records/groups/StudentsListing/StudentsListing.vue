<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { group } from '~/lib/records';
import PeopleListing from '~/components/database/records/people/RecordsListing.vue';
import { h } from 'vue';
import { xor } from 'lodash';
import RemoveStudents from '~/components/database/records/groups/StudentsListing/actions/RemoveStudents.vue';
import SelectRecordBox from '~/components/database/components/listing/SelectRecordBox.vue';

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

  records: any[] = [];
  selectedIds: string[] = [];

  @Watch('records')
  onRecordsChanged () {
    this.selectedIds.splice(0, this.selectedIds.length);
  }

  initialColumns = [
    {
      name: 'actions',
      size: 30,
      fixedSize: true,
      renderCell: record => h(
        SelectRecordBox,
        {
          props: {
            record,
            selected: this.selectedIds.includes(record.id),
          },
          on: {
            change: this.toggleSelect,
          },
        },
      ),
    },
  ];

  get isAllSelected () {
    if (!this.records.length) return false;
    return xor(this.records.map(r => r.id), this.selectedIds).length === 0;
  }

  toggleSelect ({ record, selected }) {
    const index = this.selectedIds.indexOf(record.id);
    if (index === -1) {
      this.selectedIds.push(record.id);
    } else {
      this.selectedIds.splice(index, 1);
    }
  }

  toggleSelectAll () {
    if (this.isAllSelected) {
      this.selectedIds.splice(0, this.selectedIds.length);
    } else {
      this.selectedIds.splice(0, this.selectedIds.length);
      this.selectedIds.push(...this.records.map(r => r.id));
    }
  }

  onRefresh () {
    this.searchParams = { ...this.searchParams };
  }
}
</script>

<template>
  <div class="mt-3">
    <div class="ml-1 d-flex align-items-center">
      <b-button
        variant="outline-secondary"
        size="xs"
        @click="toggleSelectAll"
      >
        <b-icon :icon="isAllSelected ? 'x' : 'check-all'" />
      </b-button>
      <div class="ml-3">
        {{ selectedIds.length }}
      </div>
      <div class="ml-3">
        <b-dropdown
          :disabled="!selectedIds.length"
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
      :initial-columns="initialColumns"
      :params="searchParams"
      @change="records = $event"
    />
  </div>
</template>
