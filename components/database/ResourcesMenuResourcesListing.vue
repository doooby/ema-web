<template>
  <ul class="list-unstyled">
    <li
      v-for="resource in shownResources"
      :key="resource.name"
      class=""
    >
      <nuxt-link :to="resource.path">
        <t :value="`db.menu.resource.${resource.name}`" class="text-capitalize" />
      </nuxt-link>
    </li>
  </ul>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { dbPages, resourcePath } from '~/config/pages';

@Component
export default class ResourcesMenuResourcesListing extends Vue {
  get shownResources (): Array<{ name: string, path: string }> {
    return dbPages.map(resource => ({
      name: resource.name,
      path: resourcePath(resource.name, resource.pages[0]),
    }));
  }
}
</script>
