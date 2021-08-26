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
        [ 'level', 'integer' ],
        [ 'start_age', 'integer' ],
        [ 'years_length', 'integer' ],
        [ 'terms_per_year', 'integer' ],
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
