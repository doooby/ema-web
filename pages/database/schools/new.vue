<template>
  <new-page
    entity="schools"
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
        [ 'country', 'assoc', { entity: 'countries' } ],
        [ 'name', 'text' ],
        [ 'address', 'text' ],
      ];
    },
  },
  methods: {
    onCreated (recordId: Number) {
      this.$router.push({ path: `/database/schools/${recordId}` });
    },
  },
});
</script>
