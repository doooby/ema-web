<template>
  <ul class="list-unstyled">
    <li
      v-for="resource in shownResources"
      :key="resource.name"
      class=""
    >
      <nuxt-link :to="resource.path">
        {{ resource.name }}
      </nuxt-link>
    </li>
  </ul>
</template>

<script lang="ts">
import Vue from 'vue';
import { startCase } from 'lodash';
import { dbPages, resourcePath } from '~/config/pages';

export default Vue.extend({
  computed: {
    shownResources (): Array<{ name: string, path: string }> {
      return dbPages.map(resource => ({
        name: startCase(this.$t(`record.${resource.name}.meta.p`) as string),
        path: resourcePath(resource.name, resource.pages[0]),
      }));
    },
  },
});
</script>
