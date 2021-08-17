<template>
  <new-page
    entity="subjects"
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
        { name: 'education_level', control: { type: 'assoc', entity: 'education_levels' } },
        { name: 'name', control: 'text' },
      ];
    },
  },
  methods: {
    onSuccess () {
      this.$router.push({ path: '/database/subjects/browse' });
    },
  },
});
</script>
