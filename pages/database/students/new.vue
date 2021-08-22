<template>
  <new-page
    entity="students"
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
        [ 'first_name_en', 'text', { label: () => { return this.$t('misc.language.en') as string; } } ],
        [ 'last_name_en', 'text', { label: () => { return this.$t('misc.language.en') as string; } } ],
        [ 'first_name', 'text' ],
        [ 'last_name', 'text' ],
        [ 'born_on', 'date' ],
      ];
    },
  },
  methods: {
    onCreated (recordId: Number) {
      this.$router.push({ path: `/database/students/${recordId}` });
    },
  },
});
</script>
