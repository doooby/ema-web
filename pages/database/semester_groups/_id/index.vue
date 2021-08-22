<template>
  <show-page
    entity="semester_groups"
    :record-id="recordId"
    :title="title"
  >
    <template #detail="{ record }">
      <div class="emb-6">
        <strong>Course:</strong>
        <show-record-link
          entity="courses"
          :record="record.course"
        />
      </div>
      <students-listing :school="record" />
    </template>
  </show-page>
</template>

<script lang="ts">
import Vue from 'vue';
import ShowPage from '~/components/database/ShowPage.vue';
import StudentsListing from '~/components/database/pages/semester_groups/StudentsListing.vue';
import ShowRecordLink from '~/components/database/ShowRecordLink.vue';

export default Vue.extend({
  components: { ShowPage, ShowRecordLink, StudentsListing },
  layout: 'database',
  data () {
    return {
      recordId: Number(this.$route.params.id),
      title: {
        text: (record: any) => record.name,
        showEditLink: true,
      },
    };
  },
});
</script>
