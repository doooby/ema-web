<template>
  <new-page
    entity="users"
    :fields="fields"
    :no-default-redirect="true"
    @success="onSuccess"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import NewPage from '~/components/database/NewPage.vue';
import { FormField } from '~/components/Form';

export default Vue.extend({
  components: { NewPage },
  layout: 'database',
  computed: {
    fields (): FormField[] {
      return [
        { name: 'country', control: { type: 'assoc', entity: 'countries' } },
        { name: 'login', control: 'text' },
        { name: 'full_name', control: 'text' },
      ];
    },
  },
  methods: {
    onSuccess () {
      this.$router.push({ path: '/database/users/browse' });
    },
  },
});
</script>
