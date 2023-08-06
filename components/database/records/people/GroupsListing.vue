<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { person } from '~/lib/records';
import RecordsListing from '~/components/database/records/groups/GroupsListing.vue';

@Component({
  components: {
    RecordsListing,
  },
})
export default class GroupsListing extends Vue {
  @Prop({ required: true }) readonly person!: person.Person;

  searchParams = {
    student_id: this.person.id,
  };
}
</script>

<template>
  <div class="mt-3">
    <records-listing
      class="mt-2"
      :params="searchParams"
    />
  </div>
</template>
