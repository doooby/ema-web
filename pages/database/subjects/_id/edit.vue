<template>
  <edit-page
    entity="subjects"
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
