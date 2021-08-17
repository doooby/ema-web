<template>
  <edit-page
    entity="education_levels"
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
        { name: 'grade', control: 'integer' },
        { name: 'semesters', control: 'integer' },
        { name: 'years_length', control: 'integer' },
        { name: 'start_age', control: 'integer' },
      ];
    },
  },
  methods: {
    onSuccess () {
      this.$router.push({ path: '/database/education_levels/browse' });
    },
  },
});
</script>
