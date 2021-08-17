<template>
  <show-page
    entity="schools"
    :record-id="recordId"
    :title="title"
  >
    <template #detail="{ record }">
      <courses-listing :school="record" />
    </template>
  </show-page>
</template>

<script lang="ts">
import Vue from 'vue';
import ShowPage from '~/components/database/ShowPage.vue';
import CoursesListing from '~/components/database/pages/schools/CoursesListing.vue';

export default Vue.extend({
  components: { ShowPage, CoursesListing },
  layout: 'database',
  data () {
    return {
      recordId: Number(this.$route.params.id),
      title: {
        text: (record: any) => record.name,
        showEditLink: true,
      },
      fetchCoursesQueryState: this.$api.newQueryState(),
    };
  },
});
</script>
