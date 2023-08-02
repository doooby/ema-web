<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { group } from '~/lib/records';
import PeopleListing from '~/components/database/records/people/PeopleListing.vue';
import RemoveStudents from '~/components/database/records/groups/StudentsListing/actions/RemoveStudents.vue';

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
    >
      <template #group-actions="{ records }">
        <remove-students
          :group="group"
          :records="records"
          @done="onRefresh"
        />
      </template>
    </people-listing>
  </div>
</template>
