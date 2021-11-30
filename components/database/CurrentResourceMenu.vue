<template>
  <div class="emt-5">
    <h2 class="text-capitalize">
      <t :value="`record.${resource.name}.meta.p`" />
    </h2>
    <ul>
      <li
        v-for="page in pages"
        :key="page.name"
      >
        <nuxt-link :to="page.path">
          {{ page.text }}
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
        text: this.$t(`db.pages.${page || 'index'}`) as string,
        path: resourcePath(name, page),
      }));
    },
  },
});
</script>
