<template>
  <div class="page-menu ep-3">
    <nuxt-link to="/database">
      <t value="db.menu.index_link" />
    </nuxt-link>
    <hr>
    <current-resource-menu
      v-if="currentResource"
      :resource="currentResource"
    />
    <hr>
    <resources-listing />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { dbPages, Resource } from '~/config/pages';
import CurrentResourceMenu from './CurrentResourceMenu.vue';
import ResourcesListing from './ResourcesListing.vue';

export default Vue.extend({
  components: { CurrentResourceMenu, ResourcesListing },
  computed: {
    currentResource (): undefined | Resource {
      const name = this.$route.path.match(/^\/database\/(\w+)\/?.*/)?.[1];
      const resource = name && dbPages.find(item => item.name === name);
      return resource || undefined;
    },
  },
});
</script>
