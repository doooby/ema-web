<template>
  <new-page
    entity="countries"
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
        [ 'name', 'text' ],
      ];
    },
  },
  methods: {
    onCreated () {
      this.$router.push({ path: '/database/countries/browse' });
    },
  },
});
</script>
