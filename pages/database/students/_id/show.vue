<template>
  <show-page
    entity="students"
    :record-id="recordId"
    :title="title"
  />
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
        text: (record: any) => record.full_name,
        showEditLink: true,
      },
    };
  },
});
</script>
