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
        [ 'full_name_en', 'text' ],
        [ 'full_name', 'text' ],
      ];
    },
  },
  methods: {
    onUpdated (record: any) {
      this.$router.push({ path: `/database/users/${record.id}` });
    },
  },
});
</script>
