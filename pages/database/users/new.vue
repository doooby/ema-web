<template>
  <new-page
    entity="users"
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
        [ 'login', 'text' ],
        [ 'full_name', 'text' ],
      ];
    },
  },
  methods: {
    onCreated () {
      this.$router.push({ path: '/database/users' });
    },
  },
});
</script>
