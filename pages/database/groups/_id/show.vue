<template>
  <show-page
    entity="groups"
    :record-id="recordId"
  >
    <template #detail="{ record }">
      year: {{ record.year }}
      <br>

      school:
      <show-record-link entity="schools" :record-id="record.school.id">
        {{ record.school.name }}
      </show-record-link>
      <br>

      course:
      <show-record-link entity="courses" :record-id="record.course.id">
        {{ record.course.name }}
      </show-record-link>
      <br>
    </template>
  </show-page>
</template>

<script lang="ts">
import Vue from 'vue';
import ShowPage from '~/components/database/ShowPage.vue';
import ShowRecordLink from '~/components/database/ShowRecordLink.vue';

export default Vue.extend({
  components: { ShowPage, ShowRecordLink },
  layout: 'database',
  data () {
    return {
      recordId: Number(this.$route.params.id),
    };
  },
});
</script>
