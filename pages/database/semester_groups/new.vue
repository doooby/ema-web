<template>
  <new-page
    entity="semester_groups"
    :fields="fields"
    :no-default-redirect="true"
    @created="onCreated"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import NewPage from '~/components/database/NewPage.vue';
import { semesterGroup } from '~/lib/records';

export default Vue.extend({
  components: { NewPage },
  layout: 'database',
  computed: {
    fields () {
      return [
        [ 'school', 'associatedRecord', { entity: 'schools' } ],
        [ 'course', 'associatedRecord', { entity: 'courses' } ],
        [ 'name', 'text' ],
        [ 'year_start', 'list', { options: semesterGroup.startYearOptions } ],
        [ 'semester', 'integer' ],
      ];
    },
  },
  methods: {
    onCreated (recordId: Number) {
      this.$router.push({ path: `/database/semester_groups/${recordId}` });
    },
  },
});
</script>
