<template>
  <new-page
    entity="education_levels"
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
        [ 'country', 'associatedRecord', { entity: 'countries' } ],
        [ 'name', 'text' ],
        [ 'grade', 'integer' ],
        [ 'start_age', 'integer' ],
        [ 'years_length', 'integer' ],
        [ 'semesters', 'integer' ],
      ];
    },
  },
  methods: {
    onCreated () {
      this.$router.push({ path: '/database/education_levels/browse' });
    },
  },
});
</script>
