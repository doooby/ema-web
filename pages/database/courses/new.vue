<template>
  <new-page
    entity="courses"
    :fields="fields"
    :no-default-redirect="true"
    @created="onCreated"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import NewPage from '~/components/database/NewPage.vue';

export default Vue.extend({
  components: { NewPage },
  layout: 'database',
  computed: {
    fields () {
      return [
        [ 'education_level', 'associatedRecord', { entity: 'education_levels' } ],
        [ 'name', 'text' ],
        [ 'grade', 'integer' ],
      ];
    },
  },
  methods: {
    onCreated (recordId: Number) {
      this.$router.push({ path: `/database/courses/${recordId}` });
    },
  },
});
</script>
