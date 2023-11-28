<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { group } from '~/lib/records';
import PeopleListing from '~/components/database/records/people/PeopleListing.vue';
import MoveStudents from '~/components/database/records/groups/students/actions/MoveStudents.vue';
import RemoveStudents from '~/components/database/records/groups/students/actions/RemoveStudents.vue';
import ActionDropoutStudents from '~/components/database/records/groups/students/actions/ActionDropoutStudents.vue';

@Component({
  components: {
    ActionDropoutStudents,
    PeopleListing,
    RemoveStudents,
    MoveStudents,
  },
})
export default class StudentsListing extends Vue {
  @Prop({ required: true }) readonly group!: group.Group;

  searchParams = {
    group_id: this.group.id,
  };

  get admissibleGroup () {
    return this.$admission.indexCan(
      'groups.change_students',
      'groups.move_students',
    );
  }

  get showGroupActions () {
    return this.admissibleGroup.canAny ||
      this.$ema.canIAny([
        'act:/groups/dropouts/create',
      ]);
  }

  onRefresh () {
    this.searchParams = { ...this.searchParams };
  }
}
</script>

<template>
  <div class="mt-3">
    <people-listing
      class="mt-2"
      :params="searchParams"
      :hide-group="true"
      :hide-contract="true"
    >
      <template
        v-if="showGroupActions"
        #group-actions="{ records }"
      >
        <move-students
          v-if="admissibleGroup['groups.move_students']"
          :from-group="group"
          :students="records"
        />
        <remove-students
          v-if="admissibleGroup['groups.change_students']"
          :group="group"
          :students="records"
          @done="onRefresh"
        />
        <ActionDropoutStudents
          v-if="$ema.canI('act:/groups/dropouts/group_create')"
          :group="group"
          :students="records"
          @done="onRefresh"
        />
      </template>
    </people-listing>
  </div>
</template>
