<template>
  <edit-page
    entity="courses"
    :fields="fields"
    :no-default-redirect="true"
    @updated="onUpdated"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import EditPage from '~/components/database/EditPage.vue';

export default Vue.extend({
  components: { EditPage },
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
    onUpdated (record: any) {
      this.$router.push({ path: `/database/courses/${record.id}` });
    },
  },
});
</script>
