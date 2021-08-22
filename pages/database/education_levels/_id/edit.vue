<template>
  <edit-page
    entity="education_levels"
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
        [ 'country', 'assoc', { entity: 'countries' } ],
        [ 'name', 'text' ],
        [ 'grade', 'integer' ],
        [ 'start_age', 'integer' ],
        [ 'years_length', 'integer' ],
        [ 'semesters', 'integer' ],
      ];
    },
  },
  methods: {
    onUpdated () {
      this.$router.push({ path: '/database/education_levels/browse' });
    },
  },
});
</script>
