<template>
  <show-page
    entity="schools"
    :record-id="recordId"
    :title="title"
  >
    <template #detail="{ record }">
      <div class="emb-6">
        <record-detail-value label="Name:">
          {{ record.name }}
        </record-detail-value>
        <record-detail-value label="Address:">
          {{ record.address }}
        </record-detail-value>
      </div>
      <courses-listing :school="record" />
    </template>
  </show-page>
</template>

<script lang="ts">
import Vue from 'vue';
import ShowPage from '~/components/database/ShowPage.vue';
import CoursesListing from '~/components/database/pages/schools/CoursesListing.vue';
import RecordDetailValue from '~/components/database/RecordDetailValue.vue';

export default Vue.extend({
  components: { ShowPage, CoursesListing, RecordDetailValue },
  layout: 'database',
  data () {
    return {
      recordId: Number(this.$route.params.id),
      title: {
        text: (record: any) => record.name_en,
        showEditLink: true,
      },
    };
  },
});
</script>
