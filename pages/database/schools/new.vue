<template>
  <new-page
    entity="schools"
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
