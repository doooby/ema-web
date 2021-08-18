<template>
  <show-page
    entity="courses"
    :record-id="recordId"
    :title="title"
  >
    <template #detail="{ record }">
      <div class="emb-6">
        <strong>Education Level:</strong>
        {{ record.education_level.caption }}
        <code class="eml-2">[{{ record.education_level.id }}]</code>
      </div>
      <subjects-listing :course="record" />
    </template>
  </show-page>
</template>

<script lang="ts">
import Vue from 'vue';
import ShowPage from '~/components/database/ShowPage.vue';
import SubjectsListing from '~/components/database/pages/courses/SubjectsListing.vue';

export default Vue.extend({
  components: { ShowPage, SubjectsListing },
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
