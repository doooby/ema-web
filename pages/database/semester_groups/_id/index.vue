<template>
  <show-page
    entity="semester_groups"
    :record-id="recordId"
    :title="title"
  >
    <template #detail="{ record }">
      <div class="emb-6">
        <record-detail-value label="School">
          <show-record-link
            entity="schools"
            :record="record.school"
          />
        </record-detail-value>
        <record-detail-value label="Course">
          <show-record-link
            entity="courses"
            :record="record.course"
          />
        </record-detail-value>
        <record-detail-value label="Year">
          {{ record.year_start }}
        </record-detail-value>
        <record-detail-value label="Semester">
          {{ record.semester }}
        </record-detail-value>
      </div>
      <students-listing :school="record" />
      <br>
    </template>
  </show-page>
</template>

<script lang="ts">
import Vue from 'vue';
import ShowPage from '~/components/database/ShowPage.vue';
import StudentsListing from '~/components/database/pages/semester_groups/StudentsListing.vue';
import ShowRecordLink from '~/components/database/ShowRecordLink.vue';
import RecordDetailValue from '~/components/database/RecordDetailValue.vue';

export default Vue.extend({
  components: { ShowPage, ShowRecordLink, StudentsListing, RecordDetailValue },
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
