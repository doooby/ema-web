<template>
  <div class="emt-5">
    <h2 class="text-capitalize">
      <t :value="`db.menu.resource.${resource.name}`" />
    </h2>
    <ul>
      <li
        v-for="page in pages"
        :key="page.name"
      >
        <nuxt-link :to="page.path">
          <t :value="page.text" />
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Resource, resourcePath } from '~/config/pages';

export default Vue.extend({
  props: {
    resource: {
      type: Object as PropType<Resource>,
      required: true,
    },
  },
  computed: {
    pages (): Array<{ name: string, text: string, path: string }> {
      const { name, pages } = this.resource;
      return pages.map(page => ({
        name: page,
        text: `db.page.${page || 'index'}.action`,
        path: resourcePath(name, page),
      }));
    },
  },
});
</script>
