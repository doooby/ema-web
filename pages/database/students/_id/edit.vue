<template>
  <edit-page
    entity="students"
    :fields="fields"
    :no-default-redirect="true"
    @updated="onUpdated"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import EditPage from '~/components/database/EditPage.vue';
import { student } from '~/lib/records';

export default Vue.extend({
  components: { EditPage },
  layout: 'database',
  computed: {
    fields () {
      return [
        ...student.entityControls(this),
      ];
    },
  },
  methods: {
    onUpdated (record: any) {
      this.$router.push({ path: `/database/students/${record.id}` });
    },
  },
});
</script>
