<template>
  <show-page
    entity="courses"
    :record-id="recordId"
    :title="title"
  >
    <template #detail="{ record }">
      DHY
    </template>
  </show-page>
</template>

<script lang="ts">
import Vue from 'vue';
import ShowPage from '~/components/database/ShowPage.vue';

export default Vue.extend({
  components: { ShowPage },
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
