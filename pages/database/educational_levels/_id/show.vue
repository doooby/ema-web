<template>
  <show-page
    entity="educational_levels"
    :record-id="recordId"
  >
    <template #detail="{ record }">
      order: {{ record.order }}
      <br>

      start_age: {{ record.start_age }}
      <br>

      years_length: {{ record.years_length }}
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
