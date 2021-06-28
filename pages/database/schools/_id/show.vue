<template>
  <show-page
    entity="schools"
    :record-id="recordId"
  >
    <template #detail="{ record }">
      address: {{ record.address }}
      <br>
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
    };
  },
});
</script>
