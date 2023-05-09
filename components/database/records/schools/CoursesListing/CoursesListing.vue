<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { school } from '~/lib/records';
import RecordsListing from '~/components/database/records/courses/RecordsListing.vue';

@Component({
  components: {
    RecordsListing,
  },
})
export default class CoursesListing extends Vue {
  @Prop({ required: true }) readonly school!: school.School;

  searchParams = {
    school_id: this.school.id,
  };
}
</script>

<template>
  <div class="mt-3">
    <records-listing
      class="mt-2"
      :params="searchParams"
      :hide-school="true"
    />
  </div>
</template>
