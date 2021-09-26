<template>
  <new-page
    entity="students"
    :fields="fields"
    :no-default-redirect="true"
    @created="onCreated"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import NewPage from '~/components/database/NewPage.vue';
import { student } from '~/lib/records';
// import AssigntToCourseControl from '~/components/database/pages/students/AssigntToCourseControl.vue';

export default Vue.extend({
  components: { NewPage },
  layout: 'database',
  computed: {
    fields () {
      return [
        ...student.entityControls(this),
        // [ 'assign_to_course', 'custom', { control: AssigntToCourseControl } ],
      ];
    },
  },
  methods: {
    onCreated (recordId: Number) {
      this.$router.push({ path: `/database/students/${recordId}` });
    },
  },
});
</script>
