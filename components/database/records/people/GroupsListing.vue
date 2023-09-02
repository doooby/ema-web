<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { person } from '~/lib/records';
import GroupsListing from '~/components/database/records/groups/GroupsListing.vue';

@Component({
  components: {
    GroupsListing,
  },
})
export default class PeopleGroupsListing extends Vue {
  @Prop({ required: true }) readonly person!: person.Person;

  searchParams = {
    student_id: this.person.id,
  };
}
</script>

<template>
  <div class="mt-3">
    <GroupsListing
      class="mt-2"
      :params="searchParams"
    />
  </div>
</template>
