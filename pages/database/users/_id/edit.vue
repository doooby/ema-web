<template>
  <edit-page
    entity="users"
    :fields="fields"
    :no-default-redirect="true"
    @success="onSuccess"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import EditPage from '~/components/database/EditPage.vue';
import { FormField } from '~/components/Form';

export default Vue.extend({
  components: { EditPage },
  layout: 'database',
  computed: {
    fields (): FormField[] {
      return [
        { name: 'login', control: 'text' },
        { name: 'full_name', control: 'text' },
      ];
    },
  },
  methods: {
    onSuccess (recordId: Number) {
      this.$router.push({ path: '/database/users/browse' });
    },
  },
});
</script>
