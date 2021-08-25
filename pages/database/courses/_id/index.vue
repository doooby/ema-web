<template>
  <show-page
    entity="courses"
    :record-id="recordId"
    :title="title"
  >
    <template #detail="{ record }">
      <div class="emb-6">
        <record-detail-value label="Education Level:">
          {{ record.education_level.caption }}
          <code class="eml-2">[{{ record.education_level.id }}]</code>
        </record-detail-value>
        <record-detail-value label="Grade:">
          {{ record.grade }}
        </record-detail-value>
      </div>
      <subjects-listing :course="record" />
    </template>
  </show-page>
</template>

<script lang="ts">
import Vue from 'vue';
import ShowPage from '~/components/database/ShowPage.vue';
import SubjectsListing from '~/components/database/pages/courses/SubjectsListing.vue';
import RecordDetailValue from '~/components/database/RecordDetailValue.vue';

export default Vue.extend({
  components: { ShowPage, SubjectsListing, RecordDetailValue },
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
