<template>
  <edit-page
    entity="schools"
    :fields="fields"
    :no-default-redirect="true"
    @updated="onUpdated"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import EditPage from '~/components/database/EditPage.vue';

export default Vue.extend({
  components: { EditPage },
  layout: 'database',
  computed: {
    fields () {
      return [
        [ 'country', 'associatedRecord', { entity: 'countries' } ],
        [ 'name_en', 'text' ],
        [ 'name', 'text' ],
        [ 'address', 'text' ],
        [ 'project', 'text' ],
      ];
    },
  },
  methods: {
    onUpdated (record: any) {
      this.$router.push({ path: `/database/schools/${record.id}` });
    },
  },
});
</script>
