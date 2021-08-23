<template>
  <edit-page
    entity="users"
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
        [ 'country', 'associatedRecord', { entity: 'countries' } ],
        [ 'login', 'text' ],
        [ 'full_name', 'text' ],
      ];
    },
  },
  methods: {
    onUpdated () {
      this.$router.push({ path: '/database/users' });
    },
  },
});
</script>
