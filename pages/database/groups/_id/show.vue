<template>
  <show-page
    entity="groups"
    :record-id="recordId"
  >
    <template #detail="{ record }">
      <div v-if="record">
        year: {{ record.year }}
      </div>
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
