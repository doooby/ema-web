<template>
  <edit-page
    entity="schools"
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
        { name: 'country', control: { type: 'assoc', entity: 'countries' } },
        { name: 'name', control: 'text' },
        { name: 'address', control: 'text' },
      ];
    },
  },
  methods: {
    onSuccess () {
      this.$router.push({ path: '/database/schools' });
    },
  },
});
</script>
