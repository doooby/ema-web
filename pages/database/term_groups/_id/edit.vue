<template>
  <edit-page
    entity="term_groups"
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
        [ 'school', 'associatedRecord', { entity: 'schools' } ],
        [ 'course', 'associatedRecord', { entity: 'courses' } ],
        [ 'name', 'text' ],
        [ 'year_start', 'integer' ],
        [ 'term', 'integer' ],
      ];
    },
  },
  methods: {
    onUpdated (record: any) {
      this.$router.push({ path: `/database/term_groups/${record.id}` });
    },
  },
});
</script>
